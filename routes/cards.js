const express = require("express");
const _ = require("lodash");
const joi = require("joi");
const auth = require("../middlewares/auth");
const router = express.Router();
const Card = require("../modules/Card");

const cardJoiSchema = joi.object({
    bizName: joi.string().required().min(2),
    bizDescription: joi.string().required().min(5).max(250),
    bizAddress: joi.string().required().min(2).max(55),
    bizPhone: joi.string().required().min(8),
    bizImage: joi.string().required().min(2)
});

// תרגיל 4
router.post("/", auth, async (req, res) => {
    try {
        const {error} = cardJoiSchema.validate(req.body);
        if(error) return res.status(400).send(error.message);
        // let existCard = await User.findOne({bizName: req.body.bizName});
        // if(existCard) return res.status(400).send("This company already have a card");
        let card = new Card(req.body);
        let bizNumberFlag = true;
        let newBizNumer;
        do{
            newBizNumer = _.random(1, 100000);
            let checkCard = await Card.findOne({bizNumber : newBizNumer});
            if(!checkCard) bizNumberFlag = false;
        } while(bizNumberFlag);
        card.bizNumber = newBizNumer;
        card.userId = req.payload._id;
        await card.save();
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send("Error in card" + error);
    }
});

// תרגיל 8
router.get("/myCards", auth, async (req,res) => {
    try {
        let card = await Card.find({userId: req.payload._id});
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});

// תרגיל 5
router.get("/:bizNumber", auth, async (req, res) => {
    try {
        let card = await Card.findOne({bizNumber: req.params.bizNumber});
        if(!card) return res.status(404).send("Card not found");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send("Error in card" + error);
    }
});

// תרגיל 6
router.put("/:bizNumber", auth, async (req, res) => {
    try {
        const {error} = cardJoiSchema.validate(req.body);
        if(error) return res.status(400).send(error.message);
        let card = await Card.findOneAndUpdate({bizNumber: req.params.bizNumber}, req.body, {new: true});
        if(!card) return res.status(404).send("Card does not exist");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);
    }
});

// תרגיל 7
router.delete("/:bizNumber", auth, async (req, res) => {
    try {
        let card = await Card.findOneAndDelete({bizNumber: req.params.bizNumber});
        if(!card) return res.status(404).send("Card does not exist");
        res.status(200).send("Card has been removed successfully");
    } catch (error) {
        res.status(400).send(error)
    }  
});

// תרגיל 9
router.get("/", auth, async (req, res) => {
    try {
        let cards = await Card.find();
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error)
    }
});




module.exports = router; 


// {
//     "bizName": "My Company 3",
//     "bizDescription": "Best in the world",
//     "bizAddress": "Derech Menachem Begin 7, Ramat Gan",
//     "bizPhone": "055-555-5557",
//     "bizImage": "https://thumbs.dreamstime.com/z/logo-bird-company-icon-business-design-abstract-nature-vector-flying-background-symbol-illustration-template-sky-modern-white-148065023.jpg"
//     }