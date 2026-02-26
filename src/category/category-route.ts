import express from 'express';
import { CategoeryController } from './category-controller';
import categoryValidator from './category-validator';
import { CategoryService } from './category-service';
import logger from '../config/logger';
import { asyncWrapper } from '../common/utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';

const router = express.Router();
const categoryService = new CategoryService();
const categoeryController = new CategoeryController(categoryService, logger);

router
  .route('/')
  .post(authenticate, canAccess([Roles.ADMIN]), categoryValidator, asyncWrapper(categoeryController.create));

export default router;
