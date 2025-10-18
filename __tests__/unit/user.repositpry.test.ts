import { UserPrismaRepository } from "@/modules/user/repository/prisma/UserPrismaRepository";

describe('UserRepository-Integration Tests', () => {
  let userRepository: UserPrismaRepository;
  beforeEach(() => {
    userRepository = new UserPrismaRepository();
  });

  describe('findUsers', () => {
    it('should return correct user structure', async () => {
      //Act
      const [users, totals] = await userRepository.findUsers({skip: 0, take: 10});

      //Assert
      expect(totals).toBeDefined();
      expect(users).toBeDefined();
      expect(users[0]).toHaveProperty("name");
      expect(users[0]).toHaveProperty("email");
      expect(users[0]).toHaveProperty("status");
    });
  });
});