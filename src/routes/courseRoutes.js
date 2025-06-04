import express from 'express'
import courseController from '../controllers/courseController.js'
import {verifyToken} from '../middlewares/verifyToken.js'
import {fileFilter, fileStorageCourse} from '../utils/multer.js'
import multer from 'multer'

const courseRoutes = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoutes.get('/course', verifyToken ,courseController.getCourse)
courseRoutes.post('/course', verifyToken , upload.single('thumbnail') ,courseController.postCourse)

export default courseRoutes