import express from 'express'
import { validateRequest } from '../middlewares/validateRequest.js'
import { signInSchema, signUpSchema } from '../utils/schema.js'
import authController from '../controllers/authController.js'

const authRoutes = express.Router()

authRoutes.post('/sign-up', validateRequest(signUpSchema), authController.signUpAction)
authRoutes.post('/sign-in', validateRequest(signInSchema), authController.signInAction)

export default authRoutes