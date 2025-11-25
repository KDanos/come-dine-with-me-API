import express from 'express'
import isSignedIn from '../middleware/isSignedIn.js'
import Dinner from '../models/dinners.js'

const router = express.Router();

//Dinner Index Route
router.get('', async (req, res, next) => {
    try {
        const allDinners = await Dinner.find().populate("host")
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
        req.body.host = req.user._id
        const newDinner = await Dinner.create(req.body)
        res.json(newDinner)
    } catch (error) {
        next(error)
    }
})

//Dinner Show Route
router.get('/:dinnerId', async (req, res, next) => {
    const dinnerId = req.params.dinnerId
    try {
        const myDinner = await Dinner.findById(dinnerId).populate("host")
        console.log(myDinner._id)
        res.json(myDinner)
        // res.json(`You are seeing info on dinner with id ${dinnerId}`)
    } catch (error) {
        next(error)
    }
})

router.put("/:dinnerId",isSignedIn, async (req,res, next) => {
    const dinnerId = req.params.dinnerId;
    try {
        const myDinner = await Dinner.findById(dinnerId);
        // console.log("This is the req.user", req.user._id)
        // console.log("This is the dinner host id", myDinner.host)
        if (!myDinner.host.equals(req.user._id)) {
            throw new Error("You do not own this dinner")
        }

        const updatedDinner = await Dinner.findByIdAndUpdate(dinnerId, req.body)
        res.json(updatedDinner)
    } catch (error) {
        next(error)
    }
})

router.delete("/:dinnerId",isSignedIn, async (req,res, next) => {
    const dinnerId = req.params.dinnerId;
    try {
        const myDinner = await Dinner.findById(dinnerId);
        if (!myDinner) {
            throw new Error("Dinner not found")
        }
        // console.log("This is the req.user", req.user._id)
        // console.log("This is the dinner host id", myDinner.host)
        if (!myDinner.host.equals(req.user._id)) {
            throw new Error("You do not own this dinner")
        }

        await Dinner.findByIdAndDelete(dinnerId);
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
})

router.post('/:dinnerId/comments', isSignedIn, async (req, res, next) => {
    try {
        const { host, theme, starter, main, dessert, drink } = req.body
        console.log(`your ${theme} dinner by ${host} contains ${starter}, ${main}, ${dessert}, and ${drink} `)
        req.body.host = req.user._id
        const newDinner = await Dinner.create(req.body)
        res.json(newDinner)
    } catch (error) {
        next(error)
    }
})


export default router