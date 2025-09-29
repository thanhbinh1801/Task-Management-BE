import { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";

export default class AuthController {
  constructor(private readonly authService: AuthService ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (exception) {
      next(exception);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    } catch (exception) {
      next(exception);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const newTokens = await this.authService.refreshToken(refreshToken);
      res.json(newTokens);
    } catch (exception) {
      next(exception);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      const isSuccess = await this.authService.forgotPassword(email);
      if (!isSuccess) return res.status(400).json({ message: "Failed to send reset password email." });
      res.status(200).json({ message: "If the email exists, we sent a reset code." });
    } catch (exception) {
      next(exception);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const isSuccess = await this.authService.verifyEmail(email, otp);
      if (!isSuccess) return res.status(400).json({ message: "Failed to verify email." });
      res.status(200).json({ message: "Email verified successfully." });
    } catch (exception) {
      next(exception);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, newPassword } = req.body;
      const isSuccess = await this.authService.resetPassword(email, newPassword);
      if (!isSuccess) return res.status(400).json({ message: "Failed to reset password." });
      res.status(200).json({ message: "Password reset successfully." });
    } catch (exception) {
      next(exception);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const { oldPassword, newPassword } = req.body;
      const isSuccess = await this.authService.changePassword(userId, oldPassword, newPassword);
      if (!isSuccess) return res.status(400).json({ message: "Failed to change password." });
      res.status(200).json({ message: "Password changed successfully." });
    } catch (exception) {
      next(exception);
    }
  };

  logout = async ( req: Request, res: Response, next: NextFunction) => {
    try{
      const { refreshToken } = req.cookies;
      if(!refreshToken) {
        return res.status(400).json({message: "No refresh token provided"});
      }
      await this.authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json({message: "Logout successful"});
    } catch (exception) {
      next(exception);
    }
  }
}
