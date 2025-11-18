import express from 'express'
import User from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

//Router
router.post('/sign-up', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        return res.status (200).json(newUser)
    } catch (error) {
        console.error('Something went wrong in the auth router.post router')
        console.log(error.message)
        return res.status(400).json(error.message)
    }
})


router.post ('/sign-in',  async (req, res) =>{
    // return res.json('you are are inside the sign-in route')
    const {username, password, _id} = req.body
    // return res.json(`The username is ${username} and the password is ${password}`)
    try {
        const userToLogin = await User.findOne({username:username})
        if(!userToLogin){
            throw new Error ('Konstantin says you need to sign-up first')
        }
        
        
        if(!bcrypt.compareSync(password,userToLogin.password)){
            throw new Error ('Konstantin says you are using the wrong password')
        }
        
        //Generate the token
        
        const token = jwt.sign(
            {user: {_id:_id, username:username}}, 
            process.env.TOKEN_SECRET,
            {expiresIn: '2d'}
        )
        return res.status(200).json({token:token})

    } catch (error) {
        console.error ('Something went wrong with the sign-in route')
        console.log(error.message)
        return res.status(400).json(error.message)
    }
})
export default router