// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', authController.redirectIfLoggedIn, authController.getLogin);
router.post('/login', authController.postLogin);
// Logout route
router.get('/logout', authController.logout);


module.exports = router;
