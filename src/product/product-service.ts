import productModel from './product-model';
import { Filter, Product } from './product-type';

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

  async getProducts(q: string, filters: Filter) {
    const searchQueryRegexp = new RegExp(q, 'i');

    const matchQuery = {
      ...filters,
      name: searchQueryRegexp,
    };

    const aggregate = productModel.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                attributes: 1,
                priceConfiguration: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$category',
      },
    ]);

    const result = await aggregate.exec();
    return result as Product[];
  }
}
