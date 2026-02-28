import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { NextFunction, Response } from 'express';
import { CreateProductRequest, Product } from './product-type';
import { ProductService } from './product-service';
import { FileStorage } from '../common/types/storage';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';

export class ProductController {
  constructor(
    private productService: ProductService,
    private storage: FileStorage,
    private logger: Logger,
  ) {}

  create = async (req: CreateProductRequest, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    if (!req.files || !req.files.image) {
      return next(createHttpError(400, 'Product image is required.'));
    }

    const image = req.files.image as UploadedFile;

    // Check if the file was truncated because it exceeded the size limit
    if (image.truncated) {
      return next(createHttpError(400, 'File size exceeds the 500KB limit.'));
    }

    // Generate unique name but keep extension
    const ext = image.name.split('.').pop();
    const imageName = `${uuidv4()}.${ext}`;

    // Upload using our storage abstraction
    const uploadResult = await this.storage.upload({
      filename: imageName,
      fileData: image.data, // This is already a Buffer from express-fileupload
      folder: 'products',
    });

    // Create product

    const { name, description, priceConfiguration, attributes, tenantId, categoryId, isPublish } = req.body;
    const product = {
      name,
      description,
      priceConfiguration: typeof priceConfiguration === 'string' ? JSON.parse(priceConfiguration) : priceConfiguration,
      attributes: typeof attributes === 'string' ? JSON.parse(attributes) : attributes,
      tenantId,
      categoryId,
      isPublish,
      image: uploadResult.filePath,
      imageFileId: uploadResult.fileId,
    };

    const newProduct = await this.productService.createProduct(product as unknown as Product);
    this.logger.info(`Created product`, { id: newProduct._id });
    res.json({ id: newProduct._id });
  };
}
