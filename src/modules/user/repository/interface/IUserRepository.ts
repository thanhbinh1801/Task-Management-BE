import { User } from "@prisma/client";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  createUser(userData: any): Promise<User>;
  updateUser(userId: string, updateData: any): Promise<User | null>;
  deleteUser(userId: string): Promise<void>;
}