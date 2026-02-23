import express from 'express';
import { CategoeryController } from './category-controller';
import categoryValidator from './category-validator';
import { CategoryService } from './category-service';
import logger from '../config/logger';
import { asyncWrapper } from '../common/utils/wrapper';
import authenticate from '../common/middlewares/authenticate';

const router = express.Router();
const categoryService = new CategoryService();
const categoeryController = new CategoeryController(categoryService, logger);

router.route('/').post(authenticate, categoryValidator, asyncWrapper(categoeryController.create));

export default router;
