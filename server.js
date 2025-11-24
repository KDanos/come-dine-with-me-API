import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
//Routers
import authRouter from './controllers/auth.js'
 import isSignedIn from './middleware/isSignedIn.js'
import errorHandler from './middleware/errorHandler.js'

//Create the application
const app = express()

//Middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//Routes
app.use('/auth', authRouter)

// app.get('/', (req, res) => {
//     res.send('Server is running')
// })


// app.get('/secure-route', isSignedIn, (req, res) =>{
//  res.json ('you have succesfull passed the isSignedIn verification')
// })
//Error handling middleware
app.use(errorHandler)


//Connections
const connect = async () => {
    try {
        const mongoDB_URI = process.env.MONGODB_URI
        await mongoose.connect(mongoDB_URI)
        console.log('you have succesfully connected to the data base')
    } catch (error) {
        console.log(error)


    }
}
connect()
app.listen(3000, () => console.log(' The application is running on port 3000'))