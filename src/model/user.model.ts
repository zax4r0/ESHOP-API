import mongoose from 'mongoose';
import { CartDocument } from './cart.model';

export interface UserDocument extends mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  access_token: string;
  refresh_token: string;
  email: string;
  phone: string;
  role: number;
  cart: CartDocument['_id'];
  name: {
    firstname: string;
    lastname: string;
  };
  password: string;
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
    comparePassword(candidatePassword: string): Promise<Boolean>;
  };
}
export enum UserRole {
  'ADMIN',
  'DIS',
  'USER',
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    access_token: { type: String, select: false },
    refresh_token: { type: String, select: false },
    phone: { type: String },
    username: { type: String },
    role: { type: String, required: true, default: UserRole.USER },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    name: {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
    },
    address:{ type: mongoose.Schema.Types.ObjectId, ref: '' },
    password: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
