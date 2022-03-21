import { HttpException } from '@/exceptions/HttpException';
import ProductModel, { ProductDocument } from '@/model/product.model';
import { isEmpty } from '@/utils/util';

class ProductService {
  public products = ProductModel;

  public async getAllProducts(limit: number, sort: string): Promise<ProductDocument[]> {
    sort == 'desc' ? -1 : 1;

    const allProducts: ProductDocument[] = await this.products
      .find()
      // .select(['_id'])
      .limit(limit || 0);
    // .sort({ _id: sort });
    return allProducts;
  }

  public async findProductById(productId: string): Promise<ProductDocument & { _id: any }> {
    if (isEmpty(productId)) throw new HttpException(400, 'This  is not ProductId');

    const findProduct: (ProductDocument & { _id: any }) | null = await this.products.findOne({ _id: productId });
    if (!findProduct) throw new HttpException(409, 'This is not Product');

    return findProduct;
  }

  public async findOneProduct(query: string): Promise<ProductDocument & { _id: any }> {
    if (isEmpty(query)) throw new HttpException(400, 'This  is not ProductId');

    const findProduct: (ProductDocument & { _id: any }) | null = await this.products.findOne({ query });
    if (!findProduct) throw new HttpException(409, 'This is not Product');

    return findProduct;
  }

  public async getProductCategories(): Promise<String[]> {
    const findProductCategories: String[] = await this.products.distinct('category');
    if (!findProductCategories) throw new HttpException(409, 'There is no Product Categories');

    return findProductCategories;
  }

  public async getProductsInCategory(category: string, limit: number, sort: string): Promise<ProductDocument[]> {
    sort == 'desc' ? -1 : 1;

    const findProductCategories: ProductDocument[] = await this.products
      .find({
        category,
      })
      .select(['_id']);
    // .sort({ _id: sort });

    if (!findProductCategories) throw new HttpException(409, 'There is no Product Categories');

    return findProductCategories;
  }

  public async addProduct(productData: ProductDocument): Promise<ProductDocument & { _id: any }> {
    if (isEmpty(productData)) throw new HttpException(400, "You're not productData");

    const createUserData: ProductDocument & { _id: any } = await this.products.create({ ...productData });
    return createUserData;
  }

  public async editProduct(producID: string, productData: ProductDocument): Promise<(ProductDocument & { _id: any }) | null> {
    if (isEmpty(producID)) throw new HttpException(400, "You're not product");

    const createUserData: (ProductDocument & { _id: any }) | null = await this.products.findByIdAndUpdate(
      { _id: producID },
      { ...productData },
      { new: true },
    );
    return createUserData;
  }

  public async deleteProduct(producID: string): Promise<(ProductDocument & { _id: any }) | null> {
    if (isEmpty(producID)) throw new HttpException(400, "You're not product");

    const createUserData: (ProductDocument & { _id: any }) | null = await this.products.findByIdAndDelete({ _id: producID });
    return createUserData;
  }
}

export default ProductService;
