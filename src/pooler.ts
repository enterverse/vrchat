import {
	Client,
	type ClientRequestInitHeaders,
	type ClientRequestInit,
	type ClientRequestMethod,
	type ClientOptions
} from "./client";

import type { StorageAdapter } from "./adapter";

export type PoolerOptions = ClientOptions;

export class Pooler {
	public constructor(
		public adapter: StorageAdapter,
		public options?: PoolerOptions
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

	// Request goes through session management and request retries.
	public async request(
		url: string,
		method?: ClientRequestMethod,
		init?: ClientRequestInit
	) {
		// Clients are disposed after each request so fresh state can be pulled from database.
		return new Client(await this.adapter.getRandom(), {
			...this.options,
			onSessionRefreshed: async (client) => {
				await this.adapter.update(client.auth.email, client.auth);
				await this.options?.onSessionRefreshed?.(client);
			}
		}).request(url, method, init);
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
}
