import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { SECRET_KEY } from '@config';
import UserModel, { UserDocument, UserRole } from '@/model/user.model';

const adminMiddleware = async (req: RequestWithUser | Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req!.header('Authorization')!.split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY as string;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse.id;

      const users = UserModel;
      const findUser: (UserDocument & { _id: any }) | null = await users.findOne({ _id: String(userId) });

      if (findUser!.role == UserRole.ADMIN) {
        // @ts-ignore
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default adminMiddleware;
