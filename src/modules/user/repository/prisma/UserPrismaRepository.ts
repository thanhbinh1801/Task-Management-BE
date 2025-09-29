import { prisma } from "@/configs/prisma";
import { IUserRepository } from "../interface/IUserRepository";
import { User } from "@prisma/client";

export class UserPrismaRepository implements IUserRepository {
  async findById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    }); 
  }

  async createUser(userData: any): Promise<User> {
    return prisma.user.create({
      data: userData
    });
  }
          
  async updateUser(userId: string, updateData: any): Promise<User | null> {
    return prisma.user.update({
      where: { id: userId },
      data: updateData
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId }
    });
  }
}
