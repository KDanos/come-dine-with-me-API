import express from 'express'
import isSignedIn from '../middleware/isSignedIn.js'
import Dinner from '../models/dinners.js'

const router = express.Router();

//Dinner Index Route
router.get('', async (req, res, next) => {
    try {
        const allDinners = await Dinner.find()
        res.json(allDinners)
        res.json(allDinners)
    } catch (error) {
        next(error)
    }
})

//Dinner Create Route
router.post('', isSignedIn, async (req, res, next) => {
    try {
        const { host, theme, starter, main, dessert, drink } = req.body
        console.log(`your ${theme} dinner by ${host} contains ${starter}, ${main}, ${dessert}, and ${drink} `)
        const newDinner = await Dinner.create(req.body)
        res.json(req.body)
    } catch (error) {
        next(error)
    }
})

//Dinner Show Route
router.get('/:dinnerId', (req, res, next) => {
    const dinnerId = req.params.dinnerId
    try {

        res.json(`You are seeing info on dinner with id ${dinnerId}`)
    } catch (error) {
        next(error)
    }
})

export default router