import { PaginateQuery } from '../product/product-type';
import toppingModel from './topping.model';
import { Topping, ToppingFilter } from './topping.type';
import { paginationLabels } from '../config/pagination';

export class ToppingService {
  async createTopping(topping: Topping) {
    return (await toppingModel.create(topping)) as Topping;
  }

  async updateTopping(toppingId: string, topping: Partial<Topping>) {
    return (await toppingModel.findByIdAndUpdate(
      {
        _id: toppingId,
      },
      {
        $set: topping,
      },
      {
        new: true,
      },
    )) as Topping;
  }

  async getToppings(q: string, filters: ToppingFilter, paginateQuery: PaginateQuery) {
    const matchQuery: ToppingFilter = { ...filters };

    // 2. Conditionally add the search query if 'q' is present
    if (q) {
      matchQuery.name = new RegExp(q, 'i');
    }

    const aggregate = toppingModel.aggregate([
      {
        $match: matchQuery,
      },
    ]);

    return toppingModel.aggregatePaginate(aggregate, {
      ...paginateQuery,
      customLabels: paginationLabels,
    });
  }

  async getById(toppingId: string) {
    return (await toppingModel.findById(toppingId)) as Topping;
  }

  async deleteById(toppingId: string) {
    return (await toppingModel.findByIdAndDelete(toppingId)) as unknown as Topping;
  }
}
