import { prisma } from '@/configs/prisma';
import { IAccountRepository } from '../interfaces/IAccountRepository';
import { Account } from '@prisma/client';

export class AccountPrismaRepository implements IAccountRepository {
    async createAccount(userData: any): Promise<Account> {
        return prisma.account.create({
            data: userData
        });
    }

    async findByUserId(userId: string): Promise<Account | null> {
        return prisma.account.findUnique({
            where: { userId }
        });
    }

    async updatePassword({ userId, password }: { userId: string; password: string }): Promise<Account | null> {
        return prisma.account.update({
            where: { userId: userId },
            data: { passwordHash: password }
        });
    }

    async checkUserInAccount( email: string) : Promise<boolean> {
        const check = await prisma.account.findFirst({
        where: { user: { email}},
        select: { id: true}
        });
        return !!check; // chuyển sang boolean
    }
}
