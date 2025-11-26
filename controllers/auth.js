import express from 'express'
import User from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

//Router
router.post('/sign-up', async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        return res.status (200).json(newUser)
    } catch (error) {
        next (error)
    }
})


router.post ('/sign-in',  async (req, res, next) =>{
    console.log(req.body)
    const {username, password, _id} = req.body
    try {
        const userToLogin = await User.findOne({username:username})
        if(!userToLogin){
            throw new Error ('Konstantin says you need to sign-up first')
        }    
        if(!bcrypt.compareSync(password,userToLogin.password)){
            throw new Error ('Konstantin says you are using the wrong password')
        }
        
        //Generate the token
        console.log (`the user id is ${userToLogin._id} and the username is ${username}`)
        const token = jwt.sign(
            {user: {_id:userToLogin._id, username:username}}, 
            process.env.TOKEN_SECRET,
            {expiresIn: '2d'}
        )
        return res.status(200).json({token:token})

    } catch (error) {
        next(error)
    }
})

router.get('', async (req, res, next) => {
    try {
        const allUsers = await User.find()
        res.json(allUsers)
    } catch (error) {
        next(error)
    }
})
export default router