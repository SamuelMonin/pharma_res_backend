const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    description: String,
    price: Number,
    score: Number
});

const commandSchema = new mongoose.Schema({
    date: String,
    cart: [productSchema],
    deliver: String,
    totalPrice: Number,
    adress: String,
    userLogin: String
});


const CommandModel = mongoose.model("commands", commandSchema);
module.exports = CommandModel;
