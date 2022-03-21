import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { ProductDocument } from './product.model';
import { UserDocument } from './user.model';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export interface CartDocument extends mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  userId: UserDocument['_id'];
  cartId: string;
  products: [
    {
      productId: ProductDocument['_id'];
      quantity: number;
      price: number;
      total: number;
    },
  ];
  active: boolean;
  subTotal: number;
}

const ItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
      default: () => `cart_${nanoid()}`,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    products: [ItemSchema],
    active: {
      type: Boolean,
      default: true,
    },
    subTotal: {
      default: 0,
      type: Number,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const CartModel = mongoose.model<CartDocument>('Cart', cartSchema);

export default CartModel;
