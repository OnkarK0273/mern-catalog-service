import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { NextFunction, Response } from 'express';
import { CreateProductRequest, Product } from './product-type';
import { ProductService } from './product-service';

export class ProductController {
  constructor(private productService: ProductService) {}

  create = async (req: CreateProductRequest, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    // Create product

    const { name, description, priceConfiguration, attributes, tenantId, categoryId, image, isPublish } = req.body;
    const product = {
      name,
      description,
      priceConfiguration: typeof priceConfiguration === 'string' ? JSON.parse(priceConfiguration) : priceConfiguration,
      attributes: typeof attributes === 'string' ? JSON.parse(attributes) : attributes,
      tenantId,
      categoryId,
      isPublish,
      // todo: image upload
      image,
    };

    const newProduct = await this.productService.createProduct(product as unknown as Product);

    res.json({ id: newProduct._id });
  };
}
