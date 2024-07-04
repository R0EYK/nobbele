// controllers/productsController.js

const Product = require('../models/productModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Fetch all products categorized as "Bags"
exports.getBags = async (req, res) => {
    const category = 'Bags'; // Assuming 'bags' is the category name
    try {
        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).send('No bags found');
        }

        res.render('bagsPage', { products }); // Render products on 'bagsPage.ejs'
    } catch (err) {
        console.error('Error fetching bags:', err);
        res.status(500).send('Server Error');
    }
};
// Fetch all products categorized as "Wallets"
exports.getWallets = async (req, res) => {
    const category = 'Wallets'; // Assuming 'wallets' is the category name
    try {
        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).send('No wallets found');
        }

        res.render('walletsPage', { products }); // Render products on 'walletsPage.ejs'
    } catch (err) {
        console.error('Error fetching wallets:', err);
        res.status(500).send('Server Error');
    }
};

// Fetch a list of products
exports.listProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("brand").exec();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Fetch and render product details by productId
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params._id;

        if (!ObjectId.isValid(productId)) {
            console.log('Invalid ObjectId format:', productId);
            return res.status(404).send('Product not found');
        }

        console.log('Fetching product details for productId:', productId);

        const product = await Product.findById(productId).populate("brand").exec();

        if (!product) {
            console.log('Product not found for productId:', productId);
            return res.status(404).send('Product not found');
        }

        res.render('productPage', { product });
    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).send('Server Error');
    }
};
