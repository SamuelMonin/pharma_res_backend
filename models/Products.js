const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    description: String,
    price: Number,
    score: Number
})

const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel;