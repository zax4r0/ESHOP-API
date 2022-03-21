import { PRIVATE_KEY, PUBLIC_KEY } from '@/config';
import jwt from 'jsonwebtoken';

export async function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, PRIVATE_KEY as string, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export async function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY as string);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
