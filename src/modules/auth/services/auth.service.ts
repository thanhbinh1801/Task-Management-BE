import { LoginResponse, RegisterResponse} from "../dtos/requests/auth.request";
import JwtUtils from "@/commons/utils/jwt.util";
import HashUtil from "@/commons/utils/hash.util";
import { NotFoundException, UnauthorizedException, ConflictException} from '@/commons'
import { AppJwtPayload } from "@/commons/dtos/jwtPayload.schema";
import { sendMail } from "@/commons/utils/mail.util";
import { IAccountRepository, ISocialAccountRepository, IOtpRepository, ITokenRepository } from "../../auth/repository/interfaces";
import { InternalServerException } from "@/commons/exceptions";
import { GoogleAuthData } from "../services/interfaces/IGoogleAuthData";
import { UserStatusEnum } from "@prisma/client";
import UserService from "@/modules/user/user.service";
import { UserManagementResponse } from "@/modules/user/dtos/responses";

export default  class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly accountRepo: IAccountRepository, 
    private readonly socialAccountsRepo: ISocialAccountRepository,
    private readonly tokenRepo: ITokenRepository,
    private readonly otpRepo: IOtpRepository,

    ) {}

  async login(data: LoginResponse) {
    const email = data.email.trim().toLowerCase();

    const user = await this.userService.getUserByEmail(email);
    if(!user) {
      throw new NotFoundException("user not found");
    }
    const account = await this.accountRepo.findByUserId(user.id);
    if (!account) {
      throw new NotFoundException("Account not found");
    }
    if (!account.passwordHash) {
      throw new UnauthorizedException("User has no password hash");
    }
    const isEqual = await HashUtil.comparePW(data.password, account.passwordHash);
    if (!isEqual) {
      throw new UnauthorizedException("password not equal");
    }
    const payload = {
      userId: user.id,
      email: user.email  
    }
    const accessToken = JwtUtils.signAccess(payload);
    const refreshToken = JwtUtils.signRefresh(payload);

    const savedRefreshToken = await this.tokenRepo.saveRefreshToken({
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000) // 7 days
    });
    if(!savedRefreshToken){
      throw new InternalServerException("Could not save refresh token");
    }

    return {
      accessToken,
      refreshToken,
      user
    }
  }

  async register(data: RegisterResponse){
    const email = data.email.trim().toLowerCase();
    const existingUser = await this.userService.getUserByEmail(email);
    if(existingUser){
      throw new ConflictException("email has exist already");
    }
    const passwordHash  = await HashUtil.hashPW(data.password);

    const user = await this.userService.createUser({
      email: data.email,
      name: data.name ?? "",
      status: UserStatusEnum.ACTIVE,
      avatarUrl: data.avatarUrl ?? "",
      passwordHash: passwordHash
    });

    return user;
  }

  async refreshToken(token: string) {
    const savedToken = await this.tokenRepo.findByRefreshToken(token);
    if (!savedToken) {
      throw new NotFoundException("refresh token not found");
    }
    const payload = JwtUtils.verifyRefresh<AppJwtPayload>(token);
    const newAccessToken = JwtUtils.signAccess({ userId: payload.userId, email: payload.email });
    const newRefreshToken = JwtUtils.signRefresh({ userId: payload.userId, email: payload.email });
    await this.tokenRepo.saveRefreshToken({
      userId: payload.userId,
      refreshToken: newRefreshToken,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000) // 7 days
    });
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const createOtp = await this.otpRepo.createOtp(user.id);
    if (!createOtp) {
      throw new InternalServerException("Could not create OTP");
    }
    await sendMail(
      user.email,
      "Password Reset OTP.",
      `Your OTP for password reset is: ${createOtp.otp}. It is valid for 10 minutes.`
    );
    return true;
  }

  async verifyEmail(email: string, otp: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const isValidOtp = await this.otpRepo.verifyOtp(user.id, otp);
    if (!isValidOtp) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }
    await this.otpRepo.deleteOtp(user.id);
    await this.userService.updateUser({ id: user.id, emailVerifiedAt: new Date()})
    return true;
  }

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new NotFoundException("user not found");
    }
    if (!user.emailVerifiedAt || (new Date().getTime() - user.emailVerifiedAt.getTime()) > 10 * 60 * 1000) {
      throw new UnauthorizedException("Email not verified for password reset");
    }
    const newPasswordHash = await HashUtil.hashPW(newPassword);
    const account = await this.accountRepo.findByUserId(user.id);
    if (!account) {
      throw new NotFoundException("Account not found");
    }
    account.passwordHash = newPasswordHash;
    await this.accountRepo.updatePassword({ userId: user.id, password: newPasswordHash });
    const oldToken = await this.tokenRepo.findByUserId(user.id);
    if(!oldToken) {
      throw new NotFoundException("No refresh token found for user");
    }
    await this.tokenRepo.deleteRefreshToken(oldToken.refreshToken);
    return true;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    if(!userId) {
      throw new UnauthorizedException("User ID is required");
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const account = await this.accountRepo.findByUserId(user.id);
    if (!account) {
      throw new NotFoundException("Account not found");
    }
    if (!account.passwordHash) {
      throw new UnauthorizedException("User has no password hash");
    }
    const isOldPasswordValid = await HashUtil.comparePW(oldPassword, account.passwordHash);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException("Invalid old password");
    }
    const newPasswordHash = await HashUtil.hashPW(newPassword);
    await this.accountRepo.updatePassword({ userId: user.id, password: newPasswordHash });
    return true;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenRepo.deleteRefreshToken(refreshToken);
    return;
  }

  async getMe(userId: string): Promise<UserManagementResponse> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async processGoogleLogin(googleAuthData: GoogleAuthData){
    const { accessToken, refreshToken, profile, user } = googleAuthData;
    if(!user.email){
      throw new UnauthorizedException("Google account has no email");
    }
    const existingUser = await this.userService.getUserByEmail(user.email);
    
    if(!existingUser){
      const createdUser = await this.userService.createGoogleUser({
        email: user.email,
        name: user.name ?? "",
        status: UserStatusEnum.ACTIVE,
        avatarUrl: user.avatar ?? "",
        provider: 'google',
        providerId: profile.id,
        refreshToken: refreshToken,
      });
      if(!createdUser){
        throw new InternalServerException("Could not create user");
      }
      return { user: createdUser, accessToken, refreshToken  };
    }
  }

  async authFailed() {
    throw new UnauthorizedException("google login failed");
  }
}