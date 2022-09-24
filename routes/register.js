const express = require("express");
const joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modules/User");
require("dotenv").config();

const uRegJoiSchema = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().min(6).email(),
    password: joi.string().required().min(8),
    biz: joi.boolean().required()
});

router.post("/", async (req, res) => {
    try {
        const {error} = uRegJoiSchema.validate(req.body)
        if(error) return res.status(400).send(error.message)
        let user = await User.findOne({email: req.body.email})
        if(user) return res.status(400).send("User already exist.")
        user = new User(req.body)
        const salt = await bcrypt.genSalt(13)
        user.password = await bcrypt.hash(user.password, salt)
        const getToken = jwt.sign({_id: user._id, biz: user.biz}, process.env.secretKey);
        await user.save()
        res.status(201).send({token: getToken});
    } catch (error) {
        res.status(400).send("Error in register." + error)
    }});

module.exports = router;



// {
//     "name": "Shalom Ben Simon",
//     "email": "shbessbb@gmail.com",
//     "password": "12345678",
//     "biz": true
// }