import { User } from "@prisma/client";
import { UserRequest, UserUpdateRequest, UserRegisterRequest, UserRegisterRequestGoogle } from "../../dtos/requests";
export interface IUserRepository {
  findUsers({ skip, take, name, email}: UserRequest): Promise<[User[], number] >;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  createUser(userData: UserRegisterRequest): Promise<User>;
  updateUser(updateData: UserUpdateRequest): Promise<User | null>;
  updateAvatarUser(userId: string, avatarUrl: string, avatarPublicId: string): Promise<User | null>;
  createGoogleUser(userData: UserRegisterRequestGoogle): Promise<User>;
}