const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://QUICK:LINKDATAPASS@linksdata.jaczn.mongodb.net/?retryWrites=true&w=majority&appName=LinksData')

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, default: null, sparse: true },
    referredBy: { type: String, default: null },   
})

module.exports = mongoose.model("UserCred", userschema)
