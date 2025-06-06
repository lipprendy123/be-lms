import categoryModel from "../models/categoryModel.js";
import courseModel from "../models/courseModel.js"
import userModel from "../models/userModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import fs from 'fs'

const courseController = {
    async getCourse(req, res) {
        try {
            const course = await courseModel.find({manager: req.user?._id}).populate({path: 'category', select: 'name -_id'}).populate({path: 'students', select: 'name'})

            const imageUrl = process.env.APP_URL + '/uploads/courses/'

            const response = course.map((item) => {
                return {
                    ...item.toObject(),
                    thumbnail_url: imageUrl + item.thumbnail,
                    total_students: item.students.length
                }
            })

            return res.status(200).json({
                success: true,
                message: 'Get data success',
                data: response
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    async postCourse(req, res) {
        try {
            const body = req.body

            const parse = mutateCourseSchema.safeParse(body)

            if (!parse.success) {
                const errorMessages = parse.error.issues.map((err) => err.message)

                if (req?.file.path && fs.existsSync(req?.file?.path)) {
                    fs.unlinkSync(req?.file?.path)
                }

                return res.status(500).json({
                    message: 'Error validation',
                    data: null,
                    errors: errorMessages
                })
            }

            const category = await categoryModel.findById(parse.data.categoryId)

            if (!category) {
                return res.status(404).json({
                    message: 'Category id not found'
                })
            }

            const course = new courseModel({
                name: parse.data.name,
                category: category._id,
                tagline: parse.data.tagline,
                description: parse.data.description,
                thumbnail: req.file?.filename,
                manager: req.user._id,
            })

            await course.save()

            await categoryModel.findByIdAndUpdate(category._id, {
                $push: {
                    courses: course._id
                },
            }, {new: true})

            await userModel.findByIdAndUpdate(req.user?._id, {
                $push: {
                    courses: course._id
                }
            },{new: true})

            return res.status(201).json({
                success: true,
                message: 'Create course success'
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

export default courseController 