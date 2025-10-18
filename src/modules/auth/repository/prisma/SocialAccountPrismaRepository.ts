import { prisma } from '@/configs/prisma';
import { ISocialAccountRepository } from '../interfaces/ISocialAccountRepository';
import { SocialAccounts } from '@prisma/client';

export class SocialAccountsPrismaRepository implements ISocialAccountRepository {
  async findByProviderId({ providerId, provider } : { provider: string, providerId: string  }): Promise<SocialAccounts | null> {
    return prisma.socialAccounts.findUnique({
      where: { provider_providerId: { provider, providerId } }
    });
  }
  async createSocialAccount(data: any): Promise<SocialAccounts> {
    return prisma.socialAccounts.create({
      data
    });
  }
  
  async checkUserInSocialAccount ( email: string): Promise<boolean> {
    const check = await prisma.socialAccounts.findFirst({
      where: { user: { email}},
      select: { id: true}
    });
    return !!check;
  }
}