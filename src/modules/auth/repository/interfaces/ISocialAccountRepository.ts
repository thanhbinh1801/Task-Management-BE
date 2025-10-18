import { SocialAccounts } from "@prisma/client";

export interface ISocialAccountRepository {
  findByProviderId(data: { providerId: string; provider: string }): Promise<SocialAccounts | null>;
  createSocialAccount(data: any): Promise<SocialAccounts>;
  checkUserInSocialAccount ( email: string): Promise<boolean> ;
}