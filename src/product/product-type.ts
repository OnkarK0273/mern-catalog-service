import type { Request } from 'express';
export interface Product {
  name: string;
  description: string;
  priceConfiguration: string | object; // Updated
  attributes: string | object; // Updated
  tenantId: string;
  categoryId: string;
  image: string;
  isPublish: boolean;
}

export interface CreateProductRequest extends Request {
  body: Product;
}
