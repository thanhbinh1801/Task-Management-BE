import { UserPrismaRepository } from "@/modules/user/repository/prisma/UserPrismaRepository";

describe('AuthRepository- Integration Tests', () => {
  let userPrismaRepository : UserPrismaRepository;
  beforeEach(() => {
    userPrismaRepository = new UserPrismaRepository();
  });

  describe('findAccount', () => {
    it('should return correct account structure for existing user', async () => {
      const account = await userPrismaRepository.findByEmail(
        "thanhbinhnkd@gmail.com"
      );

      expect(account).toBeDefined();
      expect(account).toHaveProperty('id');
      expect(account).toHaveProperty('email');
    })
  })
})