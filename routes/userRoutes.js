// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const saltRounds = 10;

router.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // הפניה לדף התחברות אם המשתמש לא מחובר
    }

    res.render('profile', { user: req.session.user });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // new user
        const newUser = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            email
        });

        await newUser.save();

        res.send('Registration successful');
    } catch (error) {
        res.status(500).send('Error registering new user: ' + error.message);
    }
});

module.exports = router;
