const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');


// Route to handle product search
router.get('/search', productsController.searchProducts);

// Route handler for fetching Bags
router.get('/Bags', productsController.getBags);

// Route handler for fetching Wallets
router.get('/Wallets', productsController.getWallets);

// Route handler for fetching Wallets
router.get('/Accessories', productsController.getAccessories);

// Route handler for fetching Jewelry
router.get('/Jewelry', productsController.getJewelry);

// Route to fetch a list of products
router.get('/list', productsController.listProducts);
// Route to fetch a list of products by brand id

router.get('/brands/:brandId', productsController.getProductsByBrandId);

// Route to fetch and render product details by productId
router.get('/:_id', productsController.getProductById);

module.exports = router;
