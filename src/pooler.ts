import {
	Client,
	type ClientRequestInitHeaders,
	type ClientRequestInit,
	type ClientRequestMethod,
	type ClientOptions
} from "./client";

import type { StorageAdapter, StorageAdapterAccount } from "./adapter";

export type PoolerOptions = ClientOptions;

export class Pooler {
	public constructor(
		public adapter: StorageAdapter,
		public options?: Partial<PoolerOptions>
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

	private createClient(account: StorageAdapterAccount) {
		return new Client(account, {
			...this.options,
			onRequestOtpKey: async (client, type) => {
				return this.options?.onRequestOtpKey?.(client, type);
			},
			onSessionRefreshed: async (client) => {
				await this.adapter.update(client.auth.email, client.auth);
				await this.options?.onSessionRefreshed?.(client);
			}
		});
	}

	private async requestInternal(
		account: StorageAdapterAccount,
		url: string,
		method: ClientRequestMethod,
		init?: ClientRequestInit
	) {
		return this.createClient(account).request(url, method, init);
	}

	public async request(
		url: string,
		method: ClientRequestMethod,
		init?: ClientRequestInit
	) {
		return this.requestInternal(
			await this.adapter.getRandom(),
			url,
			method,
			init
		);
	}

	public async requestWith(
		account: StorageAdapterAccount,
		url: string,
		method: ClientRequestMethod,
		init?: ClientRequestInit
	) {
		return this.requestInternal(account, url, method, init);
	}

	public async requestAll(
		url: string,
		method: ClientRequestMethod,
		init?: ClientRequestInit
	) {
		const accounts = await this.adapter.getAll();
		return Promise.all(
			accounts.map((account) =>
				this.requestInternal(account, url, method, init)
			)
		);
	}

	private async handleRequest<T>(
		account: StorageAdapterAccount | undefined,
		method: ClientRequestMethod,
		url: string,
		init?: ClientRequestInit
	): Promise<T> {
		const response = account
			? await this.requestWith(account, url, method, init)
			: await this.request(url, method, init);
		return response.json();
	}

	private async handleRequestAll<T>(
		method: ClientRequestMethod,
		url: string,
		init?: ClientRequestInit
	): Promise<Array<T>> {
		const responses = await this.requestAll(url, method, init);
		return Promise.all(responses.map((response) => response.json()));
	}

	public async get<T>(
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(undefined, "GET", url, { headers });
	}
	public async getWith<T>(
		account: StorageAdapterAccount,
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(account, "GET", url, { headers });
	}
	public async getAll<T>(
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<Array<T>> {
		return this.handleRequestAll("GET", url, { headers });
	}

	public async post<T>(
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(undefined, "POST", url, { body, headers });
	}
	public async postWith<T>(
		account: StorageAdapterAccount,
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(account, "POST", url, { body, headers });
	}
	public async postAll<T>(
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<Array<T>> {
		return this.handleRequestAll("POST", url, { body, headers });
	}

	public async put<T>(
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(undefined, "PUT", url, { body, headers });
	}
	public async putWith<T>(
		account: StorageAdapterAccount,
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(account, "PUT", url, { body, headers });
	}
	public async putAll<T>(
		url: string,
		body?: object,
		headers?: ClientRequestInitHeaders
	): Promise<Array<T>> {
		return this.handleRequestAll("PUT", url, { body, headers });
	}

	public async delete<T>(
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(undefined, "DELETE", url, { headers });
	}
	public async deleteWith<T>(
		account: StorageAdapterAccount,
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<T> {
		return this.handleRequest(account, "DELETE", url, { headers });
	}
	public async deleteAll<T>(
		url: string,
		headers?: ClientRequestInitHeaders
	): Promise<Array<T>> {
		return this.handleRequestAll("DELETE", url, { headers });
	}
}
