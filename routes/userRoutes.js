// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');



const router = express.Router();

router.get('/signup', authController.redirectIfLoggedIn, userController.getSignup);
router.post('/signup', userController.postSignup);




module.exports = router;
