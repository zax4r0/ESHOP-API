import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import UserModel, { UserDocument } from '@/model/user.model';

class UserService {
  public users = UserModel;

  public async findAllUser(): Promise<UserDocument[]> {
    const allUser: UserDocument[] = await this.users.find({});
    return allUser;
  }

  public async findUserById(userId: string): Promise<(UserDocument & { _id: any }) | null> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "You're not user");
    return findUser;
  }

  public async createUser(userData: UserDocument): Promise<UserDocument & { _id: any }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: UserDocument & { _id: any } = await this.users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<(UserDocument & { _id: any }) | null> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await this.users.findByIdAndUpdate({ id: userId }, { ...userData, password: hashedPassword }, { new: true });

    return updateUserData;
  }

  public async updateUserPassword(userId: string, newPassword: string): Promise<UserDocument | null> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userData");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    const hashedPassword = await hash(newPassword, 10);
    const updateUserData = await this.users.findByIdAndUpdate({ id: userId }, { password: hashedPassword }, { new: true });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<(UserDocument & { _id: any }) | null> {
    if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "You're not user");

    await this.users.deleteOne({ where: { id: userId } });
    return null;
  }

  public async findUserByEmail(email: string): Promise<(UserDocument & { _id: any }) | null> {
    if (isEmpty(email)) throw new HttpException(400, "You're not userId");

    const findUser: (UserDocument & { _id: any }) | null = await this.users.findOne({ where: { email: email } });
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }
}

export default UserService;
