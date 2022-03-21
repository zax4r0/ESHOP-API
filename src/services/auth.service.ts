import { compare, hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import TokenService from './token.service';
import UserModel, { UserDocument } from '@/model/user.model';
import SessionModel from '@/model/session.model';

class AuthService {
  public users = UserModel;
  public session = SessionModel;
  public tokenservice = new TokenService();

  public async signup(
    userData: UserDocument & { _id: any },
  ): Promise<{ access_token: string; refresh_token: string; createUserData: UserDocument & { _id: any } }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: UserDocument & { _id: any } = await this.users.create({ ...userData, password: hashedPassword });

    const access_token = await this.tokenservice.createAccessToken(createUserData);
    const refresh_token = await this.tokenservice.createRefreshToken(createUserData);

    return { createUserData, access_token, refresh_token };
  }

  public async login(userData: CreateUserDto): Promise<{ access_token: string; refresh_token: string; findUser: UserDocument & { _id: any } }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ email: userData.email }).select('password _id ');
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const access_token = await this.tokenservice.createAccessToken(findUser);
    const refresh_token = await this.tokenservice.createRefreshToken(findUser);

    return { access_token, refresh_token, findUser };
  }

  public async logout(userData: UserDocument & { _id: any }): Promise<UserDocument & { _id: any }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }
}

export default AuthService;
