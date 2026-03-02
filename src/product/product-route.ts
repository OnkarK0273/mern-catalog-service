import express from 'express';
import { ProductController } from './product-controller';
import { Roles } from '../common/constants';
import { canAccess } from '../common/middlewares/canAccess';
import authenticate from '../common/middlewares/authenticate';
import { asyncWrapper } from '../common/utils/wrapper';
import createProductValidator from './create-product-validator';
import { ProductService } from './product-service';
import fileUpload from 'express-fileupload';
import { ImageKitStorage } from '../common/services/ImageKitStorage';
import logger from '../config/logger';
import updateProductValidator from './update-product-validator';

const router = express.Router();
const productService = new ProductService();
const imageKitStorage = new ImageKitStorage();
const productController = new ProductController(productService, imageKitStorage, logger);

router.route('/').post(
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1024 }, // 500kb
  }),
  createProductValidator,
  asyncWrapper(productController.create),
);

router.route('/:id').patch(
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1024 }, // 500kb
  }),
  updateProductValidator,
  asyncWrapper(productController.update),
);

router.route('/').get(asyncWrapper(productController.index));

export default router;
