// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const saltRounds = 10;

// הצגת טופס הרשמה
router.get('/register', (req, res) => {
    res.render('register');
});

// טיפול בהרשמה
router.post('/register', async (req, res) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;

        // הצפנת סיסמה
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // יצירת משתמש חדש
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
