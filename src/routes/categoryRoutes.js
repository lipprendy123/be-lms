import express from 'express'
import categoryController from '../controllers/categoryController.js'


const categoryRoute = express.Router()

categoryRoute.get('/category', categoryController.getCategory)
categoryRoute.post('/category', categoryController.postCategory)

export default categoryRoute