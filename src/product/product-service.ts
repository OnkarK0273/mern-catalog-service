import productModel from './product-model';
import { Product } from './product-type';

export class ProductService {
  async createProduct(product: Product) {
    const newProduct = new productModel(product);
    return newProduct.save();
  }

  async getProductById(productId: string) {
    return await productModel.findById(productId);
  }

  async updateProduct(productId: string, product: Partial<Product>) {
    return await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        $set: product,
      },
      {
        new: true,
      },
    );
  }
}
