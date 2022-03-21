import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import ProductController from '@/controllers/product.controller';
import { createProductSchema } from '@/schema/product.schema';

class ProductsRoute implements Routes {
  public path = '/products';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.productController.getAllProducts);
    this.router.get(`${this.path}/:id`, authMiddleware, this.productController.getProductById);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(createProductSchema), this.productController.createProduct);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(createProductSchema), this.productController.updateProduct);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.productController.deleteProduct);
  }
}

export default ProductsRoute;
