const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Route handler for fetching Bags
router.get('/Bags', productsController.getBags);

// Route handler for fetching Wallets
router.get('/Wallets', productsController.getWallets);

// Route to fetch a list of products
router.get('/list', productsController.listProducts);

// Route to fetch and render product details by productId
router.get('/:_id', productsController.getProductById);



module.exports = router;
