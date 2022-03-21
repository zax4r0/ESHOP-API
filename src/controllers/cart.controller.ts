import { NextFunction, Response, Request } from 'express';
import CartService from '@/services/cart.service';
import ProductService from '@/services/product.service';
import { CartDocument } from '@/model/cart.model';
import { UserDocument } from '@/model/user.model';
import { RequestWithUser } from '@/interfaces/auth.interface';

class CartController {
  public cartService = new CartService();
  public productService = new ProductService();

  public addToCart = async (req: RequestWithUser | Request, res: Response, next: NextFunction): Promise<void> => {
    const user:
      | (UserDocument & {
          _id: any;
        })
      | null
      // @ts-ignore
      | undefined = req.user;

    const productId: string = req.body.productId;
    const quantity: number = req.body.quantity || 1;
    try {
      const cartItem: (CartDocument & { _id: any }) | null | undefined = await this.cartService.addToCart(user!._id!, productId, quantity);
      if (!cartItem) {
        res.status(500).json({ data: cartItem, message: `Something went wrong` });
      }
      res.status(200).json({ data: cartItem, message: `Get All Cart items` });
    } catch (error) {
      next(error);
    }
  };

  public removeFromCart = async (req: RequestWithUser | Request, res: Response, next: NextFunction): Promise<void> => {
    const user:
      | (UserDocument & {
          _id: any;
        })
      | null
      // @ts-ignore
      | undefined = req.user;
    const productId: string = req.body.productId;
    const quantity: number = req.body.quantity || 1;

    try {
      const cartItem = await this.cartService.removeFromCart(user!._id!, productId, quantity);
      if (!cartItem) {
        res.status(200).json({ data: cartItem, message: `Cart is Empty` });
      }
      res.status(200).json({ data: cartItem, message: `Removed ${productId} from Cart` });
    } catch (error) {
      next(error);
    }
  };

  public getCartByCartId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cartId: string = req.params.id;

    try {
      const cartItem: CartDocument = await this.cartService.getCartByCartId(cartId);
      res.status(200).json({ data: cartItem, message: `Cart with ${cartId}` });
    } catch (error) {
      next(error);
    }
  };

  public getMyCart = async (req: RequestWithUser | Request , res: Response, next: NextFunction): Promise<void> => {
    const user:
      | (UserDocument & {
          _id: any;
        })
      | null
      // @ts-ignore
      | undefined = req.user;
    const userId = user!._id!;
    try {
      const cartItem: CartDocument = await this.cartService.getCartByUserId(userId);
      res.status(200).json({ data: cartItem, message: `Cart for ${user!._id!} ` });
    } catch (error) {
      next(error);
    }
  };

  public getCartByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params.userId;
    try {
      const cartItem: CartDocument = await this.cartService.getCartByUserId(userId);
      res.status(200).json({ data: cartItem, message: `Cart for ${userId} ` });
    } catch (error) {
      next(error);
    }
  };

  public getAllCart = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cartItem: CartDocument = await this.cartService.getAllCart();
      res.status(200).json({ data: cartItem, message: `All Cart ` });
    } catch (error) {
      next(error);
    }
  };
}
export default CartController;
