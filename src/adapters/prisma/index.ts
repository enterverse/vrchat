import { decryptString, encryptString } from "../../utils";

import type { PrismaClient } from "@prisma/client";
import type { StorageAdapter, StorageAdapterAccount } from "../../adapter";

export interface PrismaStorageAdapterOptions {
	encryptionKey?: string;
}

export class PrismaStorageAdapter implements StorageAdapter {
	public static id = "prisma-adapter";

	public constructor(
		private prisma: PrismaClient,
		private options?: PrismaStorageAdapterOptions
	) {}

	public get isUsingEncryption(): boolean {
		return !!this.options?.encryptionKey;
	}

	public encrypt(value: string): string {
		if (!this.isUsingEncryption) {
			return value;
		}

		if (!this.options?.encryptionKey) {
			throw new Error("Encryption key is not set.");
		}

		return encryptString(value, this.options.encryptionKey);
	}

	public decrypt(value: string): string {
		if (!this.isUsingEncryption) {
			return value;
		}

		if (!this.options?.encryptionKey) {
			throw new Error("Encryption key is not set.");
		}

		return decryptString(value, this.options.encryptionKey);
	}

	public async getAll(): Promise<Array<StorageAdapterAccount>> {
		const accounts =
			(await this.prisma.vRChatAccounts.findMany()) as Array<StorageAdapterAccount>;

		return accounts.map((account) => ({
			...account,
			password: this.decrypt(account.password),
			totpKey: account.totpKey && this.decrypt(account.totpKey)
		}));
	}

	public async getRandom(): Promise<StorageAdapterAccount> {
		const all = await this.getAll();
		if (!all.length) {
			throw new Error("No accounts found.");
		}

		const account = all[Math.floor(Math.random() * all.length)];
		if (!account) {
			throw new Error("No accounts found.");
		}

		return account;
	}

	public async get(email: string): Promise<StorageAdapterAccount> {
		const account = await this.prisma.vRChatAccounts.findUnique({
			where: { email }
		});

		if (!account) {
			throw new Error(`Account with email "${email}" not found.`);
		}

		return {
			...account,
			password: this.decrypt(account.password),
			totpKey: account.totpKey && this.decrypt(account.totpKey)
		};
	}

	public set(account: StorageAdapterAccount): Promise<void> {
		return this.prisma.vRChatAccounts.create({
			data: {
				...account,
				password: this.encrypt(account.password),
				totpKey: account.totpKey && this.encrypt(account.totpKey)
			}
		});
	}

	public update(
		email: string,
		account: Partial<StorageAdapterAccount>
	): Promise<void> {
		// Remove the updatedAt and createdAt fields
		const {
			updatedAt: _u,
			createdAt: _c,
			...accountData
		} = account as Partial<StorageAdapterAccount> & {
			updatedAt?: Date;
			createdAt?: Date;
		};

		return this.prisma.vRChatAccounts.update({
			data: {
				...accountData,
				password: account.password && this.encrypt(account.password),
				totpKey: account.totpKey && this.encrypt(account.totpKey)
			},
			where: { email }
		});
	}

	public delete(email: string): Promise<void> {
		return this.prisma.vRChatAccounts.delete({
			where: { email }
		});
	}
}

export default PrismaStorageAdapter;
