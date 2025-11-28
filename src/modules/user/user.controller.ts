  import { Response, Request, NextFunction } from "express";
import UserService from "./user.service";
import { BadRequestException } from "@/commons/exceptions/badRequest.exception";
import { UserRequestSchema, UserUpdateRequestSchema, UserRegisterRequestSchema } from "./dtos/requests";

type CloudinaryFile = Express.Multer.File & {
  path: string,
  filename: string
}
export default class UserController { 
  constructor(private readonly userService: UserService) {}

  getUsers = async (req: Request, res: Response, next: NextFunction) =>  {
    try{
      const query = UserRequestSchema.parse(req.pagination);
      const users = await this.userService.getUsers(query);
      res.status(200).json({
        status: "success",
        message: "get user successfully",
        data: users
      });
    }
    catch( err ){
      next(err);
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      if(!userId) {
        throw new BadRequestException("user id not found");
      }
      const user = await this.userService.getUserById(userId);
      res.status(200).json({
        status: "success",
        message: "get user by id successfully",
        data: user
      });
    } 
    catch( err ){
      next(err);
    }
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataUser = UserRegisterRequestSchema.parse(req.body);
      if(!dataUser) {
        throw new BadRequestException("data user not found");
      }
      const newUser = await this.userService.createUser(dataUser);
      res.status(201).json({
        status: "success",
        message: "create user successfully",
        data: newUser
      })
    }
    catch( err ){
      next(err);
    }
  }

  updateUser= async (req: Request, res: Response, next: NextFunction) => {
    try{
      const dataUser = UserUpdateRequestSchema.parse(req.body);
      if(!dataUser) {
        throw new BadRequestException("data user not found");
      }
      const updateUser = await this.userService.updateUser(dataUser);
      res.status(200).json({
        status: "success",
        message: "update user successfully",
        data: updateUser
      });
    }
    catch (err) {
      next(err);
    }
  }

  updateAvatarUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const userId = req.params.id; 
      if(!userId) {
        throw new BadRequestException("user id not found");
      }
      const file = req.file as CloudinaryFile;
      console.log("File avatar: ", file);
      if( !file) {
        throw new BadRequestException("file image not found");
      }
      const avatarUrl = file.path;
      const avatarPublicId = file.filename;
      const updateAvatarUser = await this.userService.updateAvatarUser(userId, avatarUrl, avatarPublicId);
      res.status(200).json({
        status: "success",
        message: "update avatar user successfully",
        data: updateAvatarUser
      });
    }
    catch (err) {
      next(err);
    }
  }
}