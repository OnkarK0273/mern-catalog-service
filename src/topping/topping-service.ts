import toppingModel from './topping.model';
import { Topping } from './topping.type';

export class ToppingService {
  async createTopping(topping: Topping) {
    return (await toppingModel.create(topping)) as Topping;
  }

  async updateTopping(toppingId: string, topping: Partial<Topping>) {
    return await toppingModel.findByIdAndUpdate(
      {
        _id: toppingId,
      },
      {
        $set: topping,
      },
      {
        new: true,
      },
    );
  }

  async getToppings() {
    return await toppingModel.find();
  }

  async getById(toppingId: string) {
    return (await toppingModel.findById(toppingId)) as Topping;
  }

  async deleteById(toppingId: string) {
    return await toppingModel.findByIdAndDelete(toppingId);
  }
}
