import { Request, Response, NextFunction } from "express";
import  AuthService  from "./auth.service";

export default class AuthController {
  constructor(   private authService: AuthService){
    this.authService = new AuthService();
  }
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    }
    catch (exception) {
      next(exception);
    }
  }
  async login(req: Request, res: Response, next: NextFunction){
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    }
    catch (exception) {
      next(exception);
    } 
  }
}
