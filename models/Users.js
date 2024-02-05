const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    login: String,
    password: String,
    mail: String
})

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;