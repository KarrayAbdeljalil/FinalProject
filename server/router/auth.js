const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');

require('../db/conn');
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send(`hello server router`);
});

// using promises
/*
router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword} = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword ) {
        return res.status(422).json({ error: "please fill the field properly"});
    }

    User.findOne({ email: email })
        .then((userExist) => {
        if (userExist) {
            return res.status(422).json({ error : "Email already Exist"});
        }

        const user = new User({name, email, phone, work, password, cpassword });

        user.save().then(() => {
            res.status(201).json({ message: "user registred successfully"});
        }).catch((err) => res.status(500).json({ error : "Failed to registred"}));
    }).catch((err) => { console.log(err); });

});
*/

// Async-Await
router.post('/register', async (req, res) => {

    const { name, email, phone, stegref, password, cpassword} = req.body;

    if (!name || !email || !phone || !stegref || !password || !cpassword ) {
        return res.status(422).json({ error: "please fill the field properly"});
    }
    
    try {
        const userExist = await User.findOne({ email: email });
        

        if (userExist) {
            return res.status(422).json({ error : "Email already Exist"});
        } else if ( password != cpassword ) {
            return res.status(422).json({ error : "Password not matching"});
        } else {
    
        const user = new User({name, email, phone, stegref, password, cpassword });

        const userRegister = await user.save();

        if (userRegister) {
            res.status(201).json({ message: "user registred successfully"});
        } else {
            res.status(500).json({ error : "Failed to registred"})
        }
        }
    } catch(err) {
        console.log(err);
    }

});

// login route 

router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password ) {
            return res.status(400).json({message: "please fill data"})
        }
        
        const userLogin = await User.findOne({email : email });

        // console.log(userLogin);

        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000 ),
                httpOnly:true
            });

            if (!isMatch) {
                res.status(400).json({error: "Invalid credientials pass"});
            } else {
                res.json({message: "user Signedin successfully"})
            }
        } else {
            res.status(400).json({error: "Invalid credientials"});
        }

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;