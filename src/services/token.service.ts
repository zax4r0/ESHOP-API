import { sign, verify } from 'jsonwebtoken';
import { DataStoredInToken } from '@/interfaces/auth.interface';
import UserModel, { UserDocument } from '@/model/user.model';
import { SECRET_KEY } from '@/config';

class TokenService {
  public users = UserModel;

  public async createAccessToken(user: UserDocument & { _id: any }): Promise<string> {
    const dataStoredInToken: DataStoredInToken = { id: user._id };
    const secretKey: string = SECRET_KEY as string;

    const options = {
      expiresIn: '100m',
      audience: `${user._id}`,
    };

    const access_token = sign(dataStoredInToken, secretKey, options);
    await this.users.findByIdAndUpdate({ _id: user._id }, { access_token: access_token }, { new: true });
    return `${access_token}`;
  }

  public verifyAccesToken = async (access_token: string): Promise<UserDocument & { _id: any }> =>
    new Promise((resolve, reject) => {
      const secretKey: string = SECRET_KEY as string;

      verify(access_token, secretKey, async (err, payload: any) => {
        if (err) return reject(new Error('Unauthorized' + err));

        const userId: string = payload.id;

        if (!userId) {
          throw new Error('Unauthorized');
        }

        const user = await this.users.findOne({ _id: userId });

        if (!user) {
          reject(new Error('Unauthorized'));
        }

        if (access_token === user?.access_token) return resolve(user);

        reject(new Error('Unauthorized'));
      });
    });

  public async createRefreshToken(user: UserDocument & { _id: any }): Promise<string> {
    const dataStoredInToken: DataStoredInToken = { id: user._id };
    const secretKey: string = SECRET_KEY as string;

    const options = {
      expiresIn: '7d',
      audience: `${user._id}`,
    };

    const refresh_token = sign(dataStoredInToken, secretKey, options);

    await this.users.findByIdAndUpdate({ _id: user._id }, { refresh_token: refresh_token }, { new: true });

    return `${refresh_token}`;
  }

  public verifyRefreshToken = async (refresh_token: string): Promise<UserDocument & { _id: any }> =>
    new Promise((resolve, reject) => {
      const secretKey: string = SECRET_KEY as string;

      verify(refresh_token, secretKey, async (err, payload: any) => {
        if (err) return reject(new Error('Unauthorized'));

        const userId: string = payload.id;
        // console.log(`Varifing Refresh token ${userId}`);

        if (!userId) {
          throw new Error('Unauthorized');
        }

        const user = await this.users.findOne({ _id: userId });

        if (!user) {
          reject(new Error('Unauthorized'));
        }

        if (refresh_token === user?.refresh_token) return resolve(user);

        reject(new Error('Unauthorized'));
      });
    });

  public async createResetPassToken(oldPass: string, userId: string): Promise<string> {
    const dataStoredInToken: DataStoredInToken = { id: userId };
    const superSec: string = SECRET_KEY as string;
    const secretKey = superSec + oldPass;

    const options = {
      expiresIn: '15m',
    };

    const token = sign(dataStoredInToken, secretKey, options);
    return `${token}`;
  }

  public verifyResetPassToken = async (user: UserDocument & { _id: any }, resetPassToken: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const superSec: string = SECRET_KEY as string;
      const secretKey = superSec + user.password;

      verify(resetPassToken, secretKey, async (err: any, payload: any) => {
        if (err) return reject(new Error('Some Error'));

        const userId: string = payload.id;

        if (!userId) {
          throw new Error('Not Found');
        }
        const user = await this.users.findOne({ where: { id: userId } });
        if (!user) {
          reject(new Error('Not Found'));
        }
        return resolve(userId);
      });
    });

  public async sendrefreshToken(refresh_token: string): Promise<{ acessToken: string; refreshToken: string }> {
    const user = await this.verifyRefreshToken(refresh_token);

    const newAccessToken = await this.createAccessToken(user);
    const newRefreshToken = await this.createRefreshToken(user);

    await this.users.findByIdAndUpdate({ _id: user.id }, { refresh_token: newRefreshToken, access_token: newAccessToken }, { new: true });

    return { acessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

export default TokenService;
