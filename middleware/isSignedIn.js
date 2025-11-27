import jwt from 'jsonwebtoken'
import User from '../models/users.js'

const isSignedIn = async (req, res, next) => {
    try {
        console.log('------------------------------')
        if (!req.headers.authorization) {
            throw new Error('there is no authorisation header available')
        }
        const token = req.headers.authorization.replace('Bearer ', '')
        const payload = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findById(payload.user._id)
        if (!user) {
            throw new Error('During authorisation, no user is found in the database')
        }
        req.user = user      
        next()
    
    } catch (error) {
        console.error('the isSignedIn middleware is throwing an error')
        console.log(error.message)
        return res.status(401).json({ message: 'Where do you think you are going?' })
    }
}

export default isSignedIn