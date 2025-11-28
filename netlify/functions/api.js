import serverless from 'serverless-http'

import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
//Routers
import authRouter from '../../controllers/auth.js'
import dinnerRouter from '../../controllers/dinners.js' 
import errorHandler from '../../middleware/errorHandler.js'

const app = express()
const port = 3000

//Middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//Routes
app.use('/auth', authRouter)
app.use ('/dinners', dinnerRouter)

//Error handling middleware
app.use(errorHandler)


const startServers = async () => {
  try {
    // Database Connection
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔒 Database connection established')

    // Server Connection
    // app.listen(port, () => console.log(`🚀 Server up and running on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

startServers()

export const handler = serverless(app, {
  request: (req, event) => {
    if (typeof event.body === 'string') {
      try {
        req.body = JSON.parse(event.body);
      } catch (err) {
        req.body = {};
      }
    }
  }
});
