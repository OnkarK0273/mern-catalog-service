import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { NextFunction, Response, Request } from 'express';

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    // Create product
  }
}
