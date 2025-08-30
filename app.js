const express = require('express')
const app = express();
const ejs = require('ejs')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const usercred = require('./models/Signup')


app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))



app.get('/', async function(req,res) {
    res.render('Signup.ejs')
    
})


app.post('/', async function(req,res) {
    let { name, email, password, referralcode, referredBy } = req.body;


    const hashedpass = await bcrypt.hash(password, 10)

    const myreferral = Math.random().toString(36).substring(2,8)


    bcrypt.genSalt(15,(err,salt) => {
        bcrypt.hash(password,salt, async (err,hash) => {
    const newuser =  await usercred.create({
        name,
        email,
        password: hashedpass,
        referralCode: myreferral,
        referredBy: referralcode || null,
    })

    // await newuser.save()

    let usersigntoken = await jwt.sign({ email }, "secrettoken")
    res.cookie("Token", usersigntoken)

    res.render('Dashboard.ejs')

    
})

  })
   
})

app.get('/login', async function(req,res) {
    res.render('Login.ejs')
    
})

app.post('/login', async function(req,res) {
    let { email, password } = req.body;

    try {
        const findemail = await usercred.findOne({ email });
        if (!findemail) {
            return res.status(400).send("User not found. Please Sign Up.");
        }

        bcrypt.compare(password, findemail.password, async function(err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send("Error while checking password.");
            }

            if (result) {
                let token = await jwt.sign({ email: findemail.email }, "secrettoken");
                res.cookie("Token", token);
                return res.render("Dashboard.ejs");
            } else {
                return res.status(401).send("Invalid password.");
            }
        });

    } catch(error) {
        console.error(error);
        res.status(500).send("An Error Occurred while Logging In");
    }
});



app.listen(process.env.PORT, function(){
    console.log("Server is Working on PORT 3000")
})