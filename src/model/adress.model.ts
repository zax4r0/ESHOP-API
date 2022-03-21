import mongoose from 'mongoose';
import { UserDocument } from './user.model';

export interface AdressDocument extends mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  userId: UserDocument['_id'];
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

export const adressSchema = new mongoose.Schema(
  {
    address: {
      city: { type: String },
      street: { type: String },
      number: { type: Number },
      zipcode: { type: String },
      geolocation: {
        lat: { type: String },
        long: { type: String },
      },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const AdressModel = mongoose.model<AdressDocument>('User', adressSchema);

export default AdressModel;
