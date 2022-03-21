import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import AuthService from '@services/auth.service';
import UserService from '@/services/users.service';
import MailService from '@/services/mail.service';
import TokenService from '@/services/token.service';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { UserDocument } from '@/model/user.model';
class AuthController {
  public authService = new AuthService();
  public userService = new UserService();
  public tokenService = new TokenService();
  public mailService = new MailService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: UserDocument & { _id: any } = req.body;
      const { access_token, refresh_token, createUserData } = await this.authService.signup(userData);

      res.cookie('refresh_token', refresh_token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict' });
      res.status(201).json({ data: createUserData, message: 'signup', access_token: access_token });
      try {
        // const token: string = await this.tokenService.createResetPassToken(createUserData.password, createUserData.id);
        await this.mailService.sendMail({
          to: createUserData.email,
          from: 'support@officialsmappers.wtf',
          subject: 'Reset Your Password',
          template: 'password-reset',
          templateVars: {
            email: createUserData.email,
            name: createUserData.name,
            username: createUserData.email,
            // resetLink: `http://localhost:3000/users/reset-password-now/${createUserData.id}/${token}`,
          },
        });
      } catch (error) {
        res.send(error);
      }
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const { findUser, refresh_token, access_token } = await this.authService.login(userData);
      res.cookie('Authorization', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict' });
      res.cookie('refresh_token', refresh_token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict' });
      res.status(200).json({ data: [findUser.email], message: 'Hurrayy, U logged in ', access_token: access_token });
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: RequestWithUser | Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // @ts-ignore
      const user = req.user;
      const findOneUserData: UserDocument & { _id: any } |null  = await this.userService.findUserById(user!.id!);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (_req: Request, res: Response): Promise<void> => {
    try {
      // res.clearCookie('refresh_token');
      res.setHeader('Set-Cookie', ['refresh_token=; Max-age=0']);
      res.status(200).json({ message: 'logout' });
    } catch (error) {
      res.send(error);
    }
  };

  public resetpassword = async (req: Request, res: Response): Promise<void> => {
    const userId: string = req.body.userId;
    const resetPassToken: string = req.body.token;
    const password: string = req.body.password;
    try {
      const findUser: (UserDocument & { _id: any }) | null = await this.userService.findUserById(userId);
      if (!findUser) throw new Error(`User with ${userId} not found`);
      await this.tokenService.verifyResetPassToken(findUser, resetPassToken);
      await this.userService.updateUserPassword(userId, password);
    } catch (error) {
      res.send(error);
    }
  };

  public forgotpassword = async (req: Request, res: Response): Promise<void> => {
    const email: string = req.body.email;
    try {
      const findUser: (UserDocument & { _id: any }) | null = await this.userService.findUserByEmail(email);
      if (!findUser) throw new HttpException(404, `Please check ur email  ${email}`);
      const token: string = await this.tokenService.createResetPassToken(findUser.password, findUser.id);
      await this.mailService.sendMail({
        to: findUser.email,
        from: 'support@officialsmappers.wtf',
        subject: 'Reset Your Password',
        template: 'password-reset',
        templateVars: {
          email: findUser.email,
          name: findUser.name,
          username: findUser.email,
          resetLink: `http://localhost:3000/users/reset-password-now/${findUser.id}/${token}`,
        },
      });
    } catch (error) {
      res.send(error);
    }
  };
}

export default AuthController;
