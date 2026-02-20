import express, { type Response, type Request } from 'express';
import { CategoeryController } from './category-controller';
import categoryValidator from './category-validator';

const router = express.Router();

const categoeryController = new CategoeryController();

router.route('/').post(categoryValidator, (req: Request, res: Response) => categoeryController.create(req, res));

export default router;
