const { required } = require("joi");
const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    bizName:{
        type: String,
        required: true,
        minlength: 2
    },
    bizDescription:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 250
    },
    bizAddress:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 55
    },
    bizPhone:{
        type: String,
        required: true,
        minlength: 8,
    },
    bizImage:{
        type: String,
        required: true,
        minlength: 2
    },
    bizNumber:{
        type: Number,
        required: true,
        unique: true,
        min: 1
    },
    userId:{
        type: String,
        required: true
    }
});

const Card = mongoose.model("cards", cardSchema);
module.exports = Card;