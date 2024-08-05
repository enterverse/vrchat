export interface StorageAdapterAccount {
	email: string; // ID
	password: string;
	totpKey?: string;

	// If no session then the account was likely just added.
	sessionToken?: string; // Unique
	sessionTokenExpiresAt?: Date;
	totpSessionToken?: string; // Unique
	totpSessionTokenExpiresAt?: Date;
}

export type Awaitable<T> = T | PromiseLike<T>;

export type StorageAdapterAccountUpdate = Partial<StorageAdapterAccount>;

export abstract class StorageAdapter {
	public static id: string;

	public getAll(): Awaitable<Array<StorageAdapterAccount>> {
		throw new Error("StorageAdapter.getAll() is not implemented.");
	}

	public getRandom(): Awaitable<StorageAdapterAccount> {
		throw new Error("StorageAdapter.getRandom() is not implemented.");
	}

	public get(_email: string): Awaitable<StorageAdapterAccount> {
		throw new Error("StorageAdapter.get() is not implemented.");
	}

	public set(_account: StorageAdapterAccount): Awaitable<void> {
		throw new Error("StorageAdapter.set() is not implemented.");
	}

	public update(
		_email: string,
		_account: StorageAdapterAccountUpdate
	): Awaitable<void> {
		throw new Error("StorageAdapter.update() is not implemented.");
	}

	public delete(_email: string): Awaitable<void> {
		throw new Error("StorageAdapter.delete() is not implemented.");
	}
}
