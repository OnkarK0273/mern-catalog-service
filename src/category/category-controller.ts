import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category-service';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Category } from './category-types';
export class CategoeryController {
  constructor(
    private categoryService: CategoryService,
    private logger: Logger,
  ) {
    this.create = this.create.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }
    const { name, priceConfiguration, attributes } = req.body as Category;

    const category = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes,
    });

    this.logger.info(`Created category`, { id: category._id });
    res.json({ id: category._id });
  }
}
