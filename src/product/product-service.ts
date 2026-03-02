import { paginationLabels } from '../config/pagination';
import productModel from './product-model';
import { Filter, PaginateQuery, Product } from './product-type';

export class ProductService {
  async createProduct(product: Product) {
    return (await productModel.create(product)) as Product;
  }

  async getProductById(productId: string) {
    return (await productModel.findById(productId)) as Product;
  }

  async updateProduct(productId: string, product: Partial<Product>) {
    return (await productModel.findByIdAndUpdate(
      { _id: productId },
      {
        $set: product,
      },
      {
        new: true,
      },
    )) as Product;
  }

  async getProducts(q: string, filters: Filter, paginateQuery: PaginateQuery) {
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

    return productModel.aggregatePaginate(aggregate, {
      ...paginateQuery,
      customLabels: paginationLabels,
    });
  }
}
