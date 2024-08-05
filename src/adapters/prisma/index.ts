import type { PrismaClient } from "@prisma/client";
import type { StorageAdapter, StorageAdapterAccount } from "../../adapter";

export class PrismaStorageAdapter implements StorageAdapter {
	public static id = "prisma-adapter";

	public constructor(private prisma: PrismaClient) {}

	public getAll(): Promise<Array<StorageAdapterAccount>> {
		return this.prisma.vRChatAccounts.findMany();
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

		return account;
	}

	public set(account: StorageAdapterAccount): Promise<void> {
		return this.prisma.vRChatAccounts.create({
			data: account
		});
	}

	public update(
		email: string,
		account: Partial<StorageAdapterAccount>
	): Promise<void> {
		return this.prisma.vRChatAccounts.update({
			data: account,
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
