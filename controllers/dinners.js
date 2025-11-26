import express from 'express'
import isSignedIn from '../middleware/isSignedIn.js'
import Dinner from '../models/dinners.js'
import User from '../models/users.js';

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
        req.body.host = req.user._id
        const newDinner = await Dinner.create(req.body)
        const guests = req.body.guests;

        // checks if guests actually exist in the database if they don't an error is thrown
        if (guests) {
            for (const guest of guests) {
                const guestFound = await User.find({ username: guest });
                if (!guestFound || guestFound.length === 0) throw new Error("Cannot add guest as user does not exist")
            }
        }
        res.json(newDinner)
    } catch (error) {
        next(error)
    }
})

//Dinner Show Route
router.get('/:dinnerId', async (req, res, next) => {
    const dinnerId = req.params.dinnerId
    try {
        const myDinner = await Dinner.findById(dinnerId).populate(["host", "comments.owner"])
        if (!myDinner) throw new Error("Dinner not found")
        res.json(myDinner)
    } catch (error) {
        next(error)
    }
})

// Dinner update route
router.put("/:dinnerId", isSignedIn, async (req, res, next) => {
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
        const guests = req.body.guests;
        if (guests) {
            for (const guest of guests) {
                const guestFound = await User.find({ username: guest });
                if (!guestFound || guestFound.length === 0) throw new Error("Cannot add guest as user does not exist")
            }
        }
        res.json(updatedDinner)
    } catch (error) {
        next(error)
    }
})

// Dinner delete route
router.delete("/:dinnerId", isSignedIn, async (req, res, next) => {
    const dinnerId = req.params.dinnerId;
    try {
        const myDinner = await Dinner.findById(dinnerId);
        if (!myDinner) {
            throw new Error("Dinner not found")
        }
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
        req.body.owner = req.user._id

        //adds comment to comment array
        myDinner.comments.push(req.body);
        const comment = myDinner.comments[myDinner.comments.length - 1]
        comment.owner = await User.findById(req.user._id)

        await myDinner.save()

        res.status(201).json(comment)
    } catch (error) {
        next(error)
    }
})


export default router