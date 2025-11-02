import { Request, Response, NextFunction } from "express";
import AuthService from "./services/auth.service";
import passport from "passport";

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
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      return res.json({
        accessToken: result.accessToken,
        user: result.user
      });

    } catch (exception) {
      next(exception);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const newTokens = await this.authService.refreshToken(refreshToken);
      res.cookie("accessToken", newTokens.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      
      res.cookie(" refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.json(newTokens);
    } catch (exception) {
      next(exception);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      await this.authService.forgotPassword(email);
      res.status(200).json({ message: "If the email exists, we sent a reset code." });
    } catch (exception) {
      next(exception);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      await this.authService.verifyEmail(email, otp);
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
      const userId = req.users?.userId as string ;
      const { oldPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, oldPassword, newPassword);
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

  getMe = async ( req: Request, res: Response, next: NextFunction) => {
    try{
      const userId = req.users?.userId as string;
      const user = await this.authService.getMe(userId);
      res.status(200).json({
        status: "Success",
        message: "User info retrieved successfully",
        data: user
      });
    } catch (exception) {
      next(exception);
    }
  }

  // OAuth2 with Google
  googleAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { 
      scope: ['profile', 'email'] ,
      accessType: 'offline',
      prompt: 'consent'
    })(req, res, next);
  }

  googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', {
      failureRedirect: '/api/v1/auth/login-failed',
      session: false
    }, async (err, user: any) => {
      if (err) return next(err);
      if(!user) return res.redirect('/api/v1/auth/login-failed');
      try{
        const result = await this.authService.processGoogleLogin(user);
        res.cookie("refreshToken", result?.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect về dashboard với accessToken trong URL để frontend lưu vào localStorage
        return res.redirect(`${process.env.CORS_ORIGIN}/dashboard`);
      }
      catch(exception){
        next(exception);
      }
    })(req, res, next);
  }

  authFailure = async (req: Request, res: Response, next: NextFunction) => {
    try{
      await this.authService.authFailed();
    }
    catch(exception) {
      next(exception);
    }
  };
}
