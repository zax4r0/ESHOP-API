import { NextFunction, Request, Response } from 'express';
import { ProductDocument } from '@/model/product.model';
import productService from '@/services/product.service';

class ProductController {
  public productService = new productService();

  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const limit: number = req.body.limit as unknown as number;
    const sort = req.body.sort;
    try {
      const findAllProducts: ProductDocument[] = await this.productService.getAllProducts(limit, sort);

      res.status(200).json({ data: findAllProducts, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = req.params.id;
      const findOneProductData: ProductDocument & { _id: any } = await this.productService.findProductById(productId);
      // OR You can use lodash to omit the password from response 😁
      res.status(200).json({ data: findOneProductData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ProductData: ProductDocument = req.body;
      const createProductData: ProductDocument = await this.productService.addProduct(ProductData);
      // OR You can use lodash to omit the password from response 😁
      res.status(201).json({ data: createProductData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = String(req.params.id);
      const productData: ProductDocument = req.body;
      const updateProductData: (ProductDocument & { _id: any }) | null | undefined = await this.productService.editProduct(productId, productData);
      // OR You can use lodash to omit the password from response 😁
      res.status(200).json({ data: updateProductData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = String(req.params.id);
      const product:
        | (ProductDocument & {
            _id: any;
          })
        | null = await this.productService.deleteProduct(productId);
      res.status(200).json({ message: `deleted _id:${product!._id} `, title: product!.title });
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
