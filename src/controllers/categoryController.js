import { response } from "express";
import categoryModel from "../models/categoryModel.js"
import { categorySchema } from "../utils/schema.js";
import courseModel from "../models/courseModel.js";

const categoryController = {
    async getCategory(req, res) {
        try {
            const category = await categoryModel.find()

            return res.status(200).json({
                sucess: true,
                message: 'Get data success',
                data: category
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    },

    async postCategory(req, res) {
        try {
            const body = req.body

            const parse = categorySchema.safeParse(body)

            // const course = await courseModel.findById(parse.data.courseId)

            // if (!course) {
            //     return res.status(404).json({
            //         success: false,
            //         message: 'Course id not found'
            //     })
            // }

            const category = new categoryModel({
                name: parse.data.name,
                // courses: course._id
            })

            await category.save()

            return res.status(201).json({
                success: true,
                message: 'Create category success'
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

export default categoryController