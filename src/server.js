import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser"
import globalRoute from "./routes/globalRoute.js"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import categoryRoute from "./routes/categoryRoutes.js"

const app = express()
dotenv.config()
const port = 4000

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
connectDB()

app.get('/', (req, res) => {
  res.send('Hello Worlddddd!')
})

app.use('/api', globalRoute)
app.use('/api', authRoutes)
app.use('/api', paymentRoutes)
app.use('/api', courseRoutes)
app.use('/api', categoryRoute)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
