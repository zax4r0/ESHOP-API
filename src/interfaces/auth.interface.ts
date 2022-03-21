import { Request } from 'express';
import { UserDocument } from '@/model/user.model';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserDocument & { _id: any }
}
