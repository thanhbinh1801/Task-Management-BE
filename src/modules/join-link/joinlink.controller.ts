import { BadRequestException } from "@/commons";
import {Request, Response, NextFunction } from "express";
import JoinLinkService from "./joinlink.service";

export default class JoinLinkController {
  constructor(private readonly joinLinkService: JoinLinkService) {}

  // checkToken = async (req: Request, res: Response, next: NextFunction) => {
  //   try{
  //     const token = req.params.token;
  //     if(!token) {
  //       throw new BadRequestException('not found token');
  //     }
  //     const isValidToken = await this.joinLinkService.checkToken(token);
  //     res.status(200).json({
  //       status: "success",
  //       message: "token is valid",
  //       data: isValidToken
  //     })
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  join = async (req: Request, res: Response, next: NextFunction) => {
    try{
      const token = req.params.token;
      if(!token) {
        throw new BadRequestException('not found token');
      }
      const email = req.users?.email;
      if (!email) {
        throw new BadRequestException('not found email');
      }
      const actorId = req.users?.userId;
      const isJoin = await this.joinLinkService.join(token, email, actorId);
      res.status(200).json({
        status: "success",
        message: "join successfully",
        data: isJoin
      })
    } catch (err) {
      next(err);
    }
  }
}