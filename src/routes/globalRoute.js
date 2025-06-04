import express from "express";
import globalController from "../controllers/globalController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { exampleSchema } from "../utils/schema.js";

const globalRoute = express.Router()

globalRoute.get('/hello', globalController.getUser)
globalRoute.post('/tes-validate', validateRequest(exampleSchema), async (req, res) => {
    return res.json({message: 'Success'})
})

export default globalRoute