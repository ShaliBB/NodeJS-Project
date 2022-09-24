const express = require("express");
const joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modules/User");


const uLogJoiSchema = joi.object({
    email: joi.string().required().min(6).email(),
    password: joi.string().required().min(8)
});

router.post("/", async (req, res) =>{
try {
    const {error} = uLogJoiSchema.validate(req.body)
    if(error) return res.status(400).send(error.message)
    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(404).send("Wrong email or password.")
    const compResult = await bcrypt.compare(req.body.password, user.password)
    if(!compResult) return res.status(404).send("Wrong email or password.")
    const cToken = jwt.sign({_id: user._id, biz: user.biz}, process.env.SecretKey)
    res.status(201).send({token: cToken})
} catch (error) { 
}});


module.exports = router; 


// {
//     "email": "shbessbb@gmail.com",
//     "password": "12345678",
// }