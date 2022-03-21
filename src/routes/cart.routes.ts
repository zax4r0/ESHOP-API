import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import CartController from '@/controllers/cart.controller';
import { createCartSchema, deleteCartSchema, getCartByUserSchema, getCartSchema } from '@/schema/cart.schema';
import validationMiddleware from '@/middlewares/validation.middleware';

class CartsRoute implements Routes {
  public path = '/cart';
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.cartController.getMyCart);
    this.router.get(`${this.path}/:id`, authMiddleware, validationMiddleware(getCartSchema), this.cartController.getCartByCartId);
    this.router.get(`${this.path}/all`, authMiddleware, this.cartController.getAllCart);
    this.router.get(`${this.path}/user/:userId`, authMiddleware, validationMiddleware(getCartByUserSchema), this.cartController.getCartByUserId);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(createCartSchema), this.cartController.addToCart);
    this.router.delete(`${this.path}`, authMiddleware, validationMiddleware(deleteCartSchema), this.cartController.removeFromCart);
  }
}

export default CartsRoute;
