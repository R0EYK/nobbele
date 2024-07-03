const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Brand = require('../models/brandModel');

router.get('/bags', async (req, res) => {
    try {
        const products = await Product.find({ category: 'Bags' }).populate("brand").exec();
        res.render('bagsPage', { products }); // Replace 'bagsPage' with your EJS template
    } catch (err) {
        console.error('Error fetching bags:', err);
        res.status(500).send('Server Error');
    }
});

// Route to create a new product
router.post('/add', async (req, res) => {
    const { name, price, description, image, brand, gender  , category} = req.body;
        
    const newProduct = new Product({
        name,
        price,
        description,
        image: image.split(','), // Assuming image URLs are comma separated
        brand,
        gender,
        category
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

// Route to fetch a list of products
router.get('/list', async (req, res) => {
    try {
        const products = await Product.find().populate("brand").exec();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Route to fetch and render product details by productId
router.get('/:_id', async (req, res) => {
    try {
        const productId = req.params._id;

        // Validate if productId is a valid ObjectId
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

        // Render productPage.ejs with product data
        res.render('productPage', { product: product });

    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).send('Server Error');
    }
});

// Route to fetch products by category (Bags)


module.exports = router;
