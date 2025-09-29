import { Account } from "@prisma/client";

export interface IAccountRepository {
  createAccount(userData: any): Promise<Account>;
  findByUserId(userId: string): Promise<Account | null>;
  updatePassword(data: { userId: string; password: string }): Promise<Account | null>;
}
