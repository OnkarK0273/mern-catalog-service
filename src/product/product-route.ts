import express from 'express';
import { ProductController } from './product-controller';
import { Roles } from '../common/constants';
import { canAccess } from '../common/middlewares/canAccess';
import authenticate from '../common/middlewares/authenticate';
import { asyncWrapper } from '../common/utils/wrapper';
import createProductValidator from './create-product-validator';

const router = express.Router();

const productController = new ProductController();

router
  .route('/')
  .post(
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    createProductValidator,
    asyncWrapper(productController.create),
  );

export default router;
