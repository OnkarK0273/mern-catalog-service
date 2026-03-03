import { NextFunction, Response, Request } from 'express';
import { CreateToppingRequest, Topping } from './topping.type';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { ToppingService } from './topping-service';
import { Logger } from 'winston';
import { FileStorage } from '../common/types/storage';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../common/types';
import { Roles } from '../common/constants';

export class ToppingController {
  constructor(
    private toppingService: ToppingService,
    private logger: Logger,
    private storage: FileStorage,
  ) {}

  create = async (req: CreateToppingRequest, res: Response, next: NextFunction) => {
    // validation
    const result = validationResult(req);

    if (!result.isEmpty) {
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
      folder: 'topping',
    });

    const { name, price, isPublish, tenantId } = req.body;

    const topping = {
      name,
      price,
      isPublish,
      tenantId,
      image: uploadResult.filePath,
      imageFileId: uploadResult.fileId,
    };

    const newTopping = await this.toppingService.createTopping(topping as unknown as Topping);
    this.logger.info(`Created topping`, { id: newTopping._id });
    res.json({ id: newTopping._id });
  };

  update = async (req: CreateToppingRequest, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const toppingId = req.params.id as string;

    const existingProduct = await this.toppingService.getById(toppingId);
    if (!existingProduct) {
      return next(createHttpError(404, 'Product not found.'));
    }

    if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
      const tenant = (req as AuthRequest).auth.tenant;

      if (existingProduct.tenantId !== tenant) {
        return next(createHttpError(403, 'You are not allowed to access this product'));
      }
    }
    // Default to the existing values
    let updatedImagePath = existingProduct.image;
    let updatedImageId = existingProduct.imageFileId;

    if (req.files && req.files.image) {
      const image = req.files.image as UploadedFile;

      if (image.truncated) {
        return next(createHttpError(400, 'File size exceeds the 500KB limit.'));
      }

      const ext = image.name.split('.').pop();
      const imageName = `${uuidv4()}.${ext}`;

      // Upload new image
      const uploadResult = await this.storage.upload({
        filename: imageName,
        fileData: image.data,
        folder: 'topping',
      });

      // Assign the newly generated path and ID
      updatedImagePath = uploadResult.filePath;
      updatedImageId = uploadResult.fileId;

      // Delete the old image using the stored ID
      if (existingProduct.imageFileId) {
        try {
          await this.storage.delete(existingProduct.imageFileId);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          return next(createHttpError(400, 'Failed to delete old image from ImageKit:'));
        }
      }
    }

    const { name, price, isPublish, tenantId } = req.body;

    const toppingToUpdate = {
      name,
      price,
      isPublish,
      tenantId,
      image: updatedImagePath,
      imageFileId: updatedImageId,
    };

    const updatedProduct = await this.toppingService.updateTopping(toppingId, toppingToUpdate as unknown as Topping);
    res.json({ id: updatedProduct?._id });
  };

  index = async (req: Request, res: Response) => {
    const toppings = await this.toppingService.getToppings();

    res.json(toppings);
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const toppingId = req.params.id as string;

    const topping = await this.toppingService.getById(toppingId);

    if (!topping) {
      return next(createHttpError(404, 'Topping not found'));
    }
    this.logger.info(`Get one topping`, { id: topping._id });
    res.json(topping);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const toppingId = req.params.id as string;

    const topping = await this.toppingService.getById(toppingId);

    if (topping.imageFileId) {
      try {
        await this.storage.delete(topping.imageFileId);
        this.logger.info(`Topping image has been deleted`, { id: topping.imageFileId });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return next(createHttpError(400, 'Failed to delete old image from ImageKit:'));
      }
    }

    await this.toppingService.deleteById(toppingId);

    this.logger.info(`Topping has been deleted`, { id: toppingId });
    res.json({ id: toppingId });
  };
}
