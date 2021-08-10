import express from 'express'
import { body } from 'express-validator'
import { validateRequest } from '../../middlewares/validate-request'
import { signin, signup } from '../../controllers/v1/auth.controller'

const router = express.Router()

router.post(
  '/api/v1/users/signup',
  [
    body('fullname')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Full name is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters'),
  ],
  validateRequest,
  signup
)

router.post(
  '/api/v1/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  signin
)

export default router
