const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Route to create a new product
router.post('/add', async (req, res) => {
    const { productId, name, price, description, image, brand, gender } = req.body;

    // Check if productId is unique
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
        console.error('Error: Product ID already exists.');
        return res.status(400).send('Product ID already exists.');
    }

    const newProduct = new Product({
        productId,
        name,
        price,
        description,
        image: image.split(','), // Assuming image URLs are comma separated
        brand,
        gender
    });

    try {
        await newProduct.save();
        console.log('Product added:', newProduct);
        res.status(201).send('Product added successfully');
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).send('Server Error');
    }
});


// Route to get products for homepage
router.get('/list', async (req, res) => {
    try {
        const products = await Product.find().limit(3); // Fetching 3 products as an example
        console.log('MongoDB Query: Fetching products');
        console.log('Fetched Products:', products);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;