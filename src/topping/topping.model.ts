import mongoose from 'mongoose';
import { Topping } from './topping.type';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const toppingSchema = new mongoose.Schema<Topping>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageFileId: { type: String, required: true },
    isPublish: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
);

toppingSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model('Topping', toppingSchema);
