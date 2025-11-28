import { prisma } from "@/configs/prisma";
import { IUserRepository } from "../interface/IUserRepository";
import { User } from "@prisma/client";
import { UserRequest, UserUpdateRequest, UserRegisterRequest, UserRegisterRequestGoogle } from "../../dtos/requests";

export class UserPrismaRepository implements IUserRepository {
  async findUsers({ skip, take, name, email}: UserRequest): Promise<[User[], number] > {
    return Promise.all([
      prisma.user.findMany({
       skip, 
       take,
       where: {
         ...(name && {name: { contains: name, mode: "insensitive"}}), // không phân biệt hoa thường
         ...(email &&{ email: { contains: email, mode: "insensitive"}})
       }
     }),
     prisma.user.count({
       where: {
         ...(name && {name: { contains: name, mode: "insensitive"}}),
         ...(email &&{ email: { contains: email, mode: "insensitive"}})
       }
     })
    ])
  }

  async findById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { 
        email,
        account: {
          isNot: null
        }
       }
    }); 
  }

  async createUser(userData: UserRegisterRequest): Promise<User> {
    return prisma.user.upsert({
      where: {email: userData.email},
      create: {
        name: userData.name,
        email: userData.email,
        status: userData.status,
        avatarUrl: userData.avatarUrl,
        account: {
          create: {
            passwordHash: userData.passwordHash
          }
        }
      },
      update: {
        account: {
          create: { passwordHash: userData.passwordHash },
        }
      }
    });
  }
          
  async updateUser(updateData: UserUpdateRequest): Promise<User | null> {
    return prisma.user.update({
      where: { id: updateData.id },
      data: {
        ...(updateData.name && { name: updateData.name } ),
        ...(updateData.email && { email: updateData.email } ),
        ...(updateData.status != null && { status: updateData.status } ),
        ...(updateData.emailVerifiedAt != null && { emailVerifiedAt: updateData.emailVerifiedAt})
      }
    });
  }

  updateAvatarUser(userId: string, avatarUrl: string, avatarPublicId: string): Promise<User | null> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl,
        avatarPublicId
      }
    });
  }

  async createGoogleUser(userData: UserRegisterRequestGoogle): Promise<User> {
    // Kiểm tra user đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { tokens: true }
    });

    if (existingUser) {
      // User đã tồn tại - update thông tin và upsert token
      await prisma.socialAccounts.upsert({
        where: {
          provider_providerId: {
            provider: userData.provider,
            providerId: userData.providerId
          }
        },
        create: {
          userId: existingUser.id,
          provider: userData.provider,
          providerId: userData.providerId
        },
        update: {}
      });

      // Upsert token thay vì create
      await prisma.token.upsert({
        where: { userId: existingUser.id },
        create: {
          userId: existingUser.id,
          refreshToken: userData.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        update: {
          refreshToken: userData.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Update user info nếu cần
      return prisma.user.update({
        where: { id: existingUser.id },
        data: {
          ...(userData.name ? { name: userData.name } : {}),
          ...(userData.avatarUrl ? { avatarUrl: userData.avatarUrl} : {}),
        }
      });
    }

    // User chưa tồn tại - tạo mới
    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        status: userData.status,
        avatarUrl: userData.avatarUrl,
        socialAccounts: {
          create: {
            provider: userData.provider,
            providerId: userData.providerId
          }
        },
        tokens: {
          create: {
            refreshToken: userData.refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      }
    });
  }
}
