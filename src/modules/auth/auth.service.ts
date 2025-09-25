import { LoginResponse, RegisterResponse, UserResponseDTO} from "../../commons/dtos/auth.schema";
import prisma from '../../configs/prisma';
import JwtUtils from "@/commons/utils/jwt.util";
import HashUtil from "@/commons/utils/hash.util";
import { NotFoundException, UnauthorizedException, ConflictException} from '../../commons'

export default  class AuthService {
  private toUserResponseDto(user: any): UserResponseDTO{
    const {passwordHash, ...rest} = user;
    return rest as UserResponseDTO;
  }

  async login(data: LoginResponse) {
    const email = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where : {email}});
    if(!user) {
      throw new NotFoundException("user");
    }
    const isEqual = await HashUtil.comparePW(data.password, user.passwordHash);
    if(!isEqual){
      throw new UnauthorizedException();
    }
    const payload ={
      userId: user.id,
      email: user.email
    }
    const accessToken = JwtUtils.signAccess(payload);
    const refreshToken = JwtUtils.signRefresh(payload);
    return {
      accessToken,
      refreshToken,
      user: this.toUserResponseDto(user)
    }
  }

  async register(data: RegisterResponse){
    const email = data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({where: {email}});
    if(existingUser){
      throw new ConflictException("email");
    }
    const passwordHash  = await HashUtil.hashPW(data.password);

    const user = await prisma.user.create({
      data: {
        email,
        name: data.name ?? null,
        passwordHash,
        isActive: 1,
        avatarUrl: data.avatarUrl ?? null
      }
    })

    return this.toUserResponseDto(user);
  }
}