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
        if (!myDinner) throw new Error("Dinner not found")
        res.json(myDinner)
        // res.json(`You are seeing info on dinner with id ${dinnerId}`)
    } catch (error) {
        next(error)
    }
})

// Dinner update route
router.put("/:dinnerId",isSignedIn, async (req,res, next) => {
    const dinnerId = req.params.dinnerId;
    try {
        const myDinner = await Dinner.findById(dinnerId);
         if (!myDinner) {
            throw new Error("Dinner not found")
        }
        
        if (!myDinner.host.equals(req.user._id)) {
            throw new Error("You do not own this dinner")
        }

        const updatedDinner = await Dinner.findByIdAndUpdate(dinnerId, req.body)
        res.json(updatedDinner)
    } catch (error) {
        next(error)
    }
})

// Dinner delete route
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

// Create dinner comment route
router.post('/:dinnerId/comments', isSignedIn, async (req, res, next) => {
    try {
        const dinnerId = req.params.dinnerId;
        const myDinner = await Dinner.findById(dinnerId);
        if (!myDinner) throw new Error("Dinner not found")
        
        //adds logged in user as the comment owner    
        //req.body.owner = req.user._id

        console.log(req.user.username)
        
        //adds comment to comment array
        //myDinner.comments.push(req.body);


        res.json({message: "shush"})
    } catch (error) {
        next(error)
    }
})


export default router