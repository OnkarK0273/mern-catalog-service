import { body } from 'express-validator';

export default [
  body('name')
    .exists()
    .withMessage('Product name is required')
    .isString()
    .withMessage('Product name should be a string'),
  body('tenantId').exists().withMessage('Tenant id field is required'),
  body('price').exists().withMessage('Tenant id field is required'),
  body('image').custom((value, { req }) => {
    if (!req.files) throw new Error('Product image is required');
    return true;
  }),
];
