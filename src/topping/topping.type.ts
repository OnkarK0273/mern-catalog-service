import { Request } from 'express';
import mongoose from 'mongoose';

export interface Topping {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  imageFileId: string;
  isPublish: boolean;
  tenantId: string;
}

export interface CreateToppingRequest extends Request {
  body: Topping;
}
