import { InternalServerException, NotFoundException, BadRequestException } from "@/commons";
import { IUserRepository } from "./repository/interface/IUserRepository"
import { UserRequest, UserUpdateRequest, UserRegisterRequest, UserRegisterRequestGoogle } from "./dtos/requests";
import { UserResponseSchema, UserManagementResponse, UserResponse } from "./dtos/responses";
import { User } from "@prisma/client";
import z from "zod";
import { v2 as cloudinary } from "cloudinary";
export default class UserService {
  constructor(private readonly userRepo: IUserRepository) {}

 async getUsers({ skip, take, name, email }: UserRequest): Promise<UserResponse> {
    const [users, totalItems] = await this.userRepo.findUsers({ skip, take, name, email });
    if(!users) {
      throw new NotFoundException("No users found");
    }
    const ResponseUsers = z.array(UserResponseSchema).parse(users);
    const totalPages = totalItems / take;
    const page =  skip / take + 1;
    const limit = take
    return {
      data: ResponseUsers,
      meta: {
        page,
        limit,
        totalItems,
        totalPages
      }
    }
  }

  async getUserById(userId: string): Promise<UserManagementResponse> {
    const user = await this.userRepo.findById(userId);
    if(!user) {
      throw new NotFoundException("User not found");
    }
    const responseUser = UserResponseSchema.parse(user);
    return responseUser;
  }

  async createUser(dataUser: UserRegisterRequest): Promise<User> {
    if(!dataUser) {
      throw new BadRequestException("data user not found");
    }
    const user = await this.userRepo.createUser(dataUser);
    if(!user){
      throw new InternalServerException("Can not create user");
    }
    return user;
  }

  async updateUser(dataUser: UserUpdateRequest): Promise<User> {
    const existingUser = await this.userRepo.findById(dataUser.id);
    if(!existingUser) {
      throw new NotFoundException("User not found");
    }
    if(existingUser.avatarPublicId) {
      await cloudinary.uploader.destroy(existingUser.avatarPublicId);
    }

    const updateUser = await this.userRepo.updateUser(dataUser);
    if(!updateUser) {
      throw new InternalServerException("Can not update user");
    }
    return updateUser;
  }

  async updateAvatarUser(userId: string, avatarUrl: string, avatarPublicId: string): Promise<User> {
    const existingUser = await this.userRepo.findById(userId);
    if(!existingUser) {
      throw new NotFoundException("User not found");
    }
    if(existingUser.avatarPublicId) {
      await cloudinary.uploader.destroy(existingUser.avatarPublicId);
    }
    const updateAvatarUser = await this.userRepo.updateAvatarUser(userId, avatarUrl, avatarPublicId);
    if(!updateAvatarUser) {
      throw new InternalServerException("Can not update user avatar");
    }
    return updateAvatarUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findByEmail(email);
    return user ?? null;
  }

  async createGoogleUser(dataUser: UserRegisterRequestGoogle): Promise<User> {
    if(!dataUser) {
      throw new BadRequestException("data user not found");
    }
    const user = await this.userRepo.createGoogleUser(dataUser);
    if(!user){
      throw new InternalServerException("Can not create user");
    }
    return user;
  }
}