import type {
	StorageAdapter,
	StorageAdapterAccount,
	StorageAdapterAccountUpdate
} from "../../adapter";

export class MemoryStorageAdapter implements StorageAdapter {
	public static id = "memory-adapter";
	private accounts: Map<string, StorageAdapterAccount> = new Map();

	public constructor(accounts?: Array<StorageAdapterAccount>) {
		if (accounts) {
			accounts.forEach((account) => {
				this.accounts.set(account.email, account);
			});
		}
	}

	public getAll(): Array<StorageAdapterAccount> {
		return Array.from(this.accounts.values());
	}

	public getRandom(): StorageAdapterAccount {
		const account = Array.from(this.accounts.values())[
			Math.floor(Math.random() * this.accounts.size)
		];

		if (!account) {
			throw new Error("No accounts found.");
		}

		return account;
	}

	public get(email: string): StorageAdapterAccount {
		const account = this.accounts.get(email);
		if (!account) {
			throw new Error(`Account with email "${email}" not found.`);
		}

		return account;
	}

	public set(account: StorageAdapterAccount): void {
		this.accounts.set(account.email, account);
	}

	public update(email: string, account: StorageAdapterAccountUpdate): void {
		const existingAccount = this.get(email);
		if (!existingAccount) {
			throw new Error(`Account with id "${email}" not found.`);
		}

		this.accounts.set(email, { ...existingAccount, ...account });
	}

	public delete(email: string): void {
		this.accounts.delete(email);
	}
}

export default MemoryStorageAdapter;
