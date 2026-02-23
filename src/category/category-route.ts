import express from 'express';
import { CategoeryController } from './category-controller';
import categoryValidator from './category-validator';
import { CategoryService } from './category-service';
import logger from '../config/logger';

const router = express.Router();
const categoryService = new CategoryService();
const categoeryController = new CategoeryController(categoryService, logger);

router.route('/').post(categoryValidator, categoeryController.create);

export default router;
