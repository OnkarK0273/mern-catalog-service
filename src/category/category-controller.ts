import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category-service';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Category, CreateCategoryRequest, PriceConfiguration } from './category-types';

export class CategoeryController {
  constructor(
    private categoryService: CategoryService,
    private logger: Logger,
  ) {}

  create = async (req: CreateCategoryRequest, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }
    const { name, priceConfiguration, attributes } = req.body;

    const category = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes,
    });

    this.logger.info(`Created category`, { id: category._id });
    res.json({ id: category._id });
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const categoryId = req.params.id as string;
    const updateData = req.body as Partial<Category>;

    // Check if category exists
    const existingCategory = await this.categoryService.getOne(categoryId);

    if (!existingCategory) {
      return next(createHttpError(404, 'Category not found'));
    }

    if (updateData.priceConfiguration) {
      // Convert existing Map to object if it's a Map
      const existingConfig =
        existingCategory.priceConfiguration instanceof Map
          ? Object.fromEntries(existingCategory.priceConfiguration)
          : existingCategory.priceConfiguration;

      // Merge configurations
      const mergedConfig: PriceConfiguration = {
        ...existingConfig,
        ...updateData.priceConfiguration,
      };

      updateData.priceConfiguration = mergedConfig;
    }

    const updatedCategory = await this.categoryService.update(categoryId, updateData);

    this.logger.info(`Updated category`, { id: categoryId });

    res.json({
      id: updatedCategory?._id,
    });
  };

  index = async (req: Request, res: Response) => {
    const categories = await this.categoryService.getAll();
    this.logger.info(`Getting categories list`);
    res.json(categories);
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id as string;
    const category = await this.categoryService.getOne(categoryId);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    this.logger.info(`Getting category`, { id: category._id });
    res.json(category);
  };
}
