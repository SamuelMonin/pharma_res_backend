const mongoose = require("mongoose");

const codeValidationSchema = new mongoose.Schema({
    code: String,
    createdAt: Date
})

const CodeValidationModel = mongoose.model("codeValidations", codeValidationSchema);
module.exports = CodeValidationModel;