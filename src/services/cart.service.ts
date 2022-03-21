import { HttpException } from '@/exceptions/HttpException';
import CartModel, { CartDocument } from '@/model/cart.model';
import ProductModel, { ProductDocument } from '@/model/product.model';
import { logger } from '@/utils/logger';

class CartService {
  public cart = CartModel;
  public product = ProductModel;

  public async addToCart(userId: string, productId: string, quantity: number): Promise<(CartDocument & { _id: any }) | null | undefined> {
    try {
      const cart: (CartDocument & { _id: any }) | null = await this.cart.findOne({ userId: userId });
      const productDetails: (ProductDocument & { _id: any }) | null = await this.product.findOne({ _id: productId });
      // logger.warn(`${productDetails}`);
      if (cart) {
        if (!productDetails) {
          throw new HttpException(400, `Product with ${productId} not found `);
        }
      }

      //--If Cart Exists ----
      if (cart) {
        const indexFound = cart.products.findIndex((product: any) => {
          return product.productId == productId;
        });
        //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
        if (indexFound !== -1) {
          cart.products[indexFound].quantity = cart.products[indexFound].quantity + quantity;
          cart.products[indexFound].total = cart.products[indexFound].quantity * productDetails!.price!;
          cart.products[indexFound].price = productDetails!.price!;
          cart.subTotal = cart.products.map(item => item.total).reduce((acc, next) => acc + next);
        }
        //----Check if quantity is greater than 0 then add item to items array ----
        else if (quantity > 0) {
          cart.products.push({
            productId: productDetails!._id!,
            quantity: quantity,
            total: productDetails!.price! * quantity || 1,
            price: productDetails!.price!,
          });
          cart.subTotal = cart.products.map(item => item.total).reduce((acc, next) => acc + next);
        }
        //----If quantity of price is 0 throw the error -------
        else {
          throw new HttpException(400, `Someting went wrong`);
        }

        const data = await this.cart.findOneAndUpdate({ cartId: cart.cartId }, { ...cart }, { new: true });
        return data;
        //---- create new cart if not exist
      } else {
        const cartData = {
          userId: userId,
          products: [
            {
              productId: productDetails!._id!,
              quantity: quantity,
              price: productDetails!.price!,
              total: productDetails!.price! * quantity,
            },
          ],
          subTotal: productDetails!.price! * quantity,
        };
        const cart = await this.cart.create({ ...cartData });
        return cart;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  public async getCartByCartId(cartId: string): Promise<CartDocument & { _id: any }> {
    if (!cartId) throw new HttpException(400, 'cartId required');

    const cart = await this.cart.findOne({ cartId: cartId });

    if (!cart) {
      throw new HttpException(400, `Cart not exist, Please add a product to cart`);
    }
    return cart;
  }

  public async getCartByUserId(userId: string): Promise<CartDocument & { _id: any }> {
    if (!userId) throw new HttpException(400, 'userId required');

    const cart = await this.cart.findOne({ userId: userId });

    if (!cart) {
      throw new HttpException(400, `Cart not exist, Please add a product to cart`);
    }

    return cart;
  }

  public async getAllCart(): Promise<CartDocument & { _id: any }> {
    const cart = await this.cart.findOne();
    if (!cart) {
      throw new HttpException(400, `Cart not exist, Please add a product to cart`);
    }
    return cart;
  }

  public async removeFromCart(userId: string, productId: string, quantity: number): Promise<(CartDocument & { _id: any }) | null | undefined> {
    try {
      const cart: (CartDocument & { _id: any }) | null = await this.cart.findOne({ userId: userId });
      const productDetails: (ProductDocument & { _id: any }) | null = await this.product.findOne({ _id: productId });
      if (cart) {
        if (!productDetails) {
          throw new HttpException(400, `product with ${productId} Not found`);
        }
      }
      //--If Cart Exists ----
      if (cart) {
        const indexFound = cart.products.findIndex((product: any) => {
          return product.productId == productId;
        });

        if (indexFound !== -1) {
          if (cart.products[indexFound].quantity >= 1) {
            cart.products[indexFound].quantity = cart.products[indexFound].quantity - quantity;

            // Product Quantity is 0, removing item
            if (cart.products[indexFound].quantity || quantity <= 0) {
              cart.subTotal = 0;
              cart.products.splice(indexFound, 1);
              const newCart:
                | (CartDocument & {
                    _id: any;
                  })
                | null = await this.cart.findOneAndUpdate({ cartId: cart.cartId }, { ...cart }, { new: true });
              return newCart;
              // decreese quantity
            } else {
              cart.products[indexFound].total! = cart.products[indexFound].quantity * productDetails!.price!;
              cart.products[indexFound].price! = productDetails!.price!;
              cart.subTotal = cart.products.map(item => item.total).reduce((acc, next) => acc + next);

              const newCart:
                | (CartDocument & {
                    _id: any;
                  })
                | null = await this.cart.findOneAndUpdate({ cartId: cart.cartId }, { ...cart }, { new: true });
              return newCart;
            }
          }
        }
      } else {
        throw new HttpException(400, `Cart not exist, Please add a product to cart`);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}

export default CartService;
