// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../controllers/authController');


const router = express.Router();

router.get('/login', authController.redirectIfLoggedIn, authController.getLogin);
router.post('/login', authController.postLogin);
// Logout route
router.get('/logout', authController.logout);

router.get('/settings', isAuthenticated, (req, res) => {
    res.render('privateSettingsPage');  // Render your private settings page
});


module.exports = router;
