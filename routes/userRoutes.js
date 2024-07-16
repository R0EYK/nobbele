// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');



const router = express.Router();

router.get('/signup', authController.redirectIfLoggedIn, userController.getSignup);
router.post('/signup', userController.postSignup);

// GET /user/orders - Display all user orders
router.get('/orders', authController.isAuthenticated , userController.getUserOrders);


module.exports = router;
