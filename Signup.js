const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB)

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, default: null, sparse: true },
    referredBy: { type: String, default: null },   
})

module.exports = mongoose.model("UserCred", userschema)
