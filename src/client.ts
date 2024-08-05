import { authenticator } from "otplib";
authenticator.options = { step: 30 };

import {
	cookieFromArray,
	promiseLock,
	reduceCookiesObject,
	type PromiseLock
} from "./utils";
import { type CurrentUserTotp, Routes } from "./api";
import { RefreshError, RequestError } from "./errors";

import type { Verify2FAResult, VerifyAuthTokenResult } from "vrchat";
import type { Awaitable, StorageAdapterAccount } from "./adapter";

export interface ClientOptions {
	maxSessionRefreshAttempts: number;
	sessionRefreshInterval: number;
	maxRequestRetryAttempts: number;
	requestRetryInterval: number;
	baseUrl: string;
	userAgent?: string;
	onSessionRefreshed?: (client: Client) => Awaitable<void>;
	onRequestOtpKey?: (
		client: Client,
		type: CurrentUserTotp["requiresTwoFactorAuth"]
	) => Awaitable<string | undefined>;
}

export type ClientRequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ClientRequestInitHeaders = RequestInit["headers"];
export interface ClientRequestInit {
	body?: object;
	headers?: ClientRequestInitHeaders;
}

export class Client {
	public options: ClientOptions;
	private refreshLock: PromiseLock | undefined;

	public constructor(
		public auth: StorageAdapterAccount,
		options?: Partial<ClientOptions>
	) {
		this.options = {
			baseUrl: "https://vrchat.com/api/1",
			maxRequestRetryAttempts: 5,
			maxSessionRefreshAttempts: 3,
			requestRetryInterval: 100,
			sessionRefreshInterval: 500,
			...options
		};
	}

	// Raw request doesn't go through session management and request retries.
	public async requestRaw(url: string, init?: RequestInit): Promise<Response> {
		try {
			const response = await fetch(this.options.baseUrl + url, {
				...init,
				headers: {
					...(init?.headers || {}),
					"User-Agent":
						this.options.userAgent ||
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0"
				}
			});
			if (!response.ok) throw new RequestError(response);

			return response;
		} catch (reason) {
			throw reason instanceof RequestError
				? reason
				: new RequestError(undefined, String(reason));
		}
	}

	// Request goes through session management and request retries.
	public async request(
		url: string,
		method: ClientRequestMethod = "GET",
		init?: ClientRequestInit
	): Promise<Response> {
		if (
			!this.auth.sessionToken ||
			(this.auth.sessionTokenExpiresAt &&
				this.auth.sessionTokenExpiresAt < new Date())
		) {
			await this.refreshSession();
		}

		let attempts = 0;
		let response: Response | undefined;

		do {
			try {
				return await this.requestRaw(url, {
					body: init?.body ? JSON.stringify(init.body) : undefined,
					headers: {
						...(init?.headers || {}),
						"Content-Type": "application/json",
						Cookie: reduceCookiesObject({
							auth: this.auth.sessionToken,
							twoFactorAuth: this.auth.totpSessionToken
						})
					},
					method
				});
			} catch (reason) {
				if (attempts >= this.options.maxRequestRetryAttempts) break;

				if (reason instanceof RequestError) response = reason.response;
				if (reason instanceof RequestError && reason.hintsRefreshSession()) {
					await this.refreshSession();
				}

				attempts++;
				await new Promise((resolve) =>
					setTimeout(resolve, this.options.requestRetryInterval)
				);
			}
		} while (attempts <= this.options.maxRequestRetryAttempts);

		throw new RequestError(response, `after ${attempts} attempts`);
	}

	// Shortcut methods for common HTTP methods. Will call `request` internally.
	public async get<T>(
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.request(url, "GET", { headers }).then((response) =>
			response.json()
		);
	}
	public async post<T>(
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.request(url, "POST", { body, headers }).then((response) =>
			response.json()
		);
	}
	public async put<T>(
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.request(url, "PUT", { body, headers }).then((response) =>
			response.json()
		);
	}
	public async delete<T>(
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.request(url, "DELETE", { headers }).then((response) =>
			response.json()
		);
	}

	// Abstract away all the session management from the end user.
	private async refreshSession() {
		if (this.refreshLock) return await this.refreshLock.promise;

		this.refreshLock = promiseLock();
		const resolve = () => {
			const promise = this.refreshLock?.promise;
			this.refreshLock?.resolve();
			this.refreshLock = undefined;
			return promise;
		};
		const reject = (error: Error) => {
			const promise = this.refreshLock?.promise;
			this.refreshLock?.reject(error);
			this.refreshLock = undefined;
			return promise;
		};

		let attempts = 0;

		do {
			try {
				const loginResponse = await this.requestRaw(Routes.login(), {
					headers: {
						Authorization:
							"Basic " +
							Buffer.from(
								`${encodeURIComponent(this.auth.email)}:${encodeURIComponent(this.auth.password)}`
							).toString("base64"),
						"Content-Type": "application/json"
					}
				});

				const sessionCookie = cookieFromArray(
					loginResponse.headers.getSetCookie(),
					"auth"
				);
				if (!sessionCookie)
					throw new RefreshError("Failed to get session cookie after login.");

				this.auth.sessionToken = sessionCookie.value;
				this.auth.sessionTokenExpiresAt = sessionCookie.expires;

				const body = (await loginResponse.json()) as CurrentUserTotp;

				if (body.requiresTwoFactorAuth?.length) {
					let code: string | undefined;
					if (this.auth.totpKey) {
						code = authenticator.generate(this.auth.totpKey);
					} else if (this.options.onRequestOtpKey) {
						code = await this.options.onRequestOtpKey(
							this,
							body.requiresTwoFactorAuth
						);
						if (!code) {
							throw new RefreshError(
								"Called options.onRequestOtpKey, but returned undefined."
							);
						}
					} else {
						throw new RefreshError(
							"One time password required but auth.totpKey is undefined and options.onRequestOtpKey is not set."
						);
					}

					const verifyResponse = await this.requestRaw(Routes.verify2FACode(), {
						body: JSON.stringify({ code }),
						headers: {
							"Content-Type": "application/json",
							Cookie: reduceCookiesObject({
								auth: this.auth.sessionToken
							})
						},
						method: "POST"
					});

					const totpBody = (await verifyResponse.json()) as Verify2FAResult;
					if (!totpBody.verified)
						throw new RefreshError("TOTP key failed to verify.");

					const totpAuthCookie = cookieFromArray(
						verifyResponse.headers.getSetCookie(),
						"twoFactorAuth"
					);

					if (totpAuthCookie) {
						this.auth.totpSessionToken = totpAuthCookie.value;
						this.auth.totpSessionTokenExpiresAt = totpAuthCookie.expires;
					}

					const verifyAuthTokenResponse = await this.requestRaw(
						Routes.verifyAuthToken(),
						{
							headers: {
								Cookie: reduceCookiesObject({
									auth: this.auth.sessionToken,
									twoFactorAuth: this.auth.totpSessionToken
								})
							}
						}
					);

					const verifyAuthTokenBody =
						(await verifyAuthTokenResponse.json()) as VerifyAuthTokenResult;
					if (!verifyAuthTokenBody.ok)
						throw new RefreshError("Auth token result verification is not ok.");
				} else if (!body.id) {
					throw new RefreshError("Failed to get current user after login.");
				}

				await this.options.onSessionRefreshed?.(this);
				return resolve();
			} catch (reason) {
				if (attempts >= this.options.maxSessionRefreshAttempts) {
					if (reason instanceof RefreshError) return reject(reason);
					return reject(
						new RefreshError(
							`Failed to refresh session after ${attempts} attempts.`
						)
					);
				}

				attempts++;
				await new Promise((resolve) =>
					setTimeout(resolve, this.options.sessionRefreshInterval)
				);
			}
		} while (attempts <= this.options.maxSessionRefreshAttempts);
	}
}
