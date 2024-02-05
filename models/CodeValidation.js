const mongoose = require("mongoose");

const codeValidationSchema = new mongoose.Schema({
    code: Number,
    createdAt: Date
})

const CodeValidationModel = mongoose.model("codeValidations", codeValidationSchema);
module.exports = CodeValidationModel;