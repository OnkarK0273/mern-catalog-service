import { ImageKitStorage } from '../common/services/ImageKitStorage';
import express from 'express';
import { ToppingService } from './topping-service';
import createToppingValidator from './create-topping-validator';
import { ToppingController } from './topping-controller';
import logger from '../config/logger';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import fileUpload from 'express-fileupload';
import { Roles } from '../common/constants';
import { asyncWrapper } from '../common/utils/wrapper';
import updateToppingValidator from './update-topping-validator';
import { createMessageProducerBroker } from '../common/factories/brokerFactory';

const router = express.Router();

const imageKitStorage = new ImageKitStorage();
const toppingService = new ToppingService();
const broker = createMessageProducerBroker();
const toppingController = new ToppingController(toppingService, logger, imageKitStorage, broker);

router.route('/').post(
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1024 }, // 500kb
  }),
  createToppingValidator,
  asyncWrapper(toppingController.create),
);

router.route('/:id').patch(
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1024 }, // 500kb
  }),
  updateToppingValidator,
  asyncWrapper(toppingController.update),
);

router.route('/').get(asyncWrapper(toppingController.index));
router.route('/:id').get(asyncWrapper(toppingController.getOne));
router.route('/:id').delete(asyncWrapper(toppingController.delete));

export default router;
