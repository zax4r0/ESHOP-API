import { Request } from 'express';

declare module 'Request' {
  export interface RequestWithUser {
    user: { [key: string]: any };
  }
}
