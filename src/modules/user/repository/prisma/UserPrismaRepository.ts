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
      },
       include: {
        account: true,
      },
    });
  }
          
  async updateUser(updateData: UserUpdateRequest): Promise<User | null> {
    return prisma.user.update({
      where: { id: updateData.id },
      data: {
        ...(updateData.name && { name: updateData.name } ),
        ...(updateData.email && { email: updateData.email } ),
        ...(updateData.status != null && { status: updateData.status } ),
        ...(updateData.avatarUrl && { avatarUrl: updateData.avatarUrl } ),
        ...(updateData.emailVerifiedAt != null && { emailVerifiedAt: updateData.emailVerifiedAt})
      }
    });
  }

  async createGoogleUser(userData: UserRegisterRequestGoogle): Promise<User> {
    return prisma.user.upsert({
      where: {email: userData.email},
      create: {
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
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
          }
        }
      },
      update: {
        ...(userData.name ? {name : userData.name} : {}),
        ...(userData.avatarUrl ? { avatarUrl: userData.avatarUrl} : {}),
        socialAccounts: {
          connectOrCreate: {
            where: {
              provider_providerId: {
                provider: userData.provider,
                providerId: userData.providerId
              },
            },
            create: {
              provider: userData.provider,
              providerId: userData.providerId,
            },
          },
        },
        tokens: {
          create: {
            refreshToken: userData.refreshToken,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
          },
        },
      },
      include: {
        account : true,
        socialAccounts: true
      }
    });
  }
}
