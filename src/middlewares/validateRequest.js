import { ZodError } from "zod"

export const validateRequest = (schema) => async (req, res, next) => {
    try {
        schema.parse(req.body)

        next()
    } catch (error) {
        if (error instanceof ZodError) {
            const errMessage = error.issues.map((err => err.message))

            return res.status(500).json({error: 'Invalid request', details: errMessage})
        }

        return res.status(500).json({error: 'Internal server error'})
    }
}