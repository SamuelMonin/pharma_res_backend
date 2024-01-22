const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    description: String,
    price: Number,
    score: Number
});

const userSchema = new mongoose.Schema({
    login: String,
    password: String
})

const commandSchema = new mongoose.Schema({
    date: String,
    cart: [productSchema],
    deliver: String,
    totalPrice: Number,
    adress: String,
    user: userSchema
});


const CommandModel = mongoose.model("commands", commandSchema);
module.exports = CommandModel;
