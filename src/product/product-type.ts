import type { Request } from 'express';
import mongoose from 'mongoose';
export interface Product {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  priceConfiguration: string | object; // Updated
  attributes: string | object; // Updated
  tenantId: string;
  categoryId: string;
  image: string;
  imageFileId: string;
  isPublish: boolean;
}

export interface CreateProductRequest extends Request {
  body: Product;
}

export interface Filter {
  tenantId?: string;
  categoryId?: mongoose.Types.ObjectId;
  isPublish?: boolean;
}

export interface PaginateQuery {
  page: number;
  limit: number;
}
