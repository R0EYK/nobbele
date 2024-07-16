const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authController = require('../controllers/authController');


// GET /checkout
router.get('/', authController.isAuthenticated, checkoutController.getCheckout);

// POST /checkout
router.post('/', authController.isAuthenticated , checkoutController.createOrder);

// Route for order completion page.
router.get('/:id', checkoutController.ensureOrderOwner, checkoutController.getOrderSuccess);


module.exports = router;
