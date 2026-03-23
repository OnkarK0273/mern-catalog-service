import { Request } from 'express';
import mongoose from 'mongoose';

export interface Topping {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  imageFileId: string;
  isPublish: boolean;
  categoryId: string;
  tenantId: string;
}

export interface CreateToppingRequest extends Request {
  body: Topping;
}

export interface ToppingFilter {
  tenantId?: string;
  categoryId?: mongoose.Types.ObjectId;
  isPublish?: boolean;
  name?: RegExp;
}
