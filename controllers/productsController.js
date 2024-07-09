// controllers/productsController.js

const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


exports.getSaleProducts = async (req, res) => {
    try {
        // Find products with a discount
        const products = await Product.find({ discount: { $gt: 0 } }).populate("brand").exec();
        res.render('sale', { products });
    } catch (error) {
        res.status(500).send('Error fetching sale products');
    }
};

exports.getProductsByBrand = async (req, res) => {
    try {
      const brandId = req.params.brandId;
  
      console.log('Brand ID:', brandId);
      console.log('Is valid ObjectId:', mongoose.Types.ObjectId.isValid(brandId));
  
      // Check if brandId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(brandId)) {
        return res.status(400).send('Invalid brand ID');
      }
  
      // Using mongoose.Types.ObjectId to convert brandId
      const products = await Product.find({ brand: new mongoose.Types.ObjectId(brandId) })
                                    .populate("brand")
                                    .exec();
  
      console.log('Fetched products:', products);
  
      res.render('productByBrand', { products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error fetching products: ' + error.message);
    }
  };
// Controller method for handling product searches
exports.searchProducts = async (req, res) => {
    const query = req.query.q; // Get the search query from the URL parameter

    try {
        // Perform a case-insensitive search for products with names containing the query
        const results = await Product.find({ name: { $regex: new RegExp(query, 'i') } }).populate("brand").exec();

        if (results.length === 0) {
            return res.render('searchResult', { query, results, message: 'No results found.' });
        }

        res.render('searchResult', { query, results });
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).send('Server Error');
    }
};


// Fetch all products categorized as "jewelry"
exports.getJewelry = async (req, res) => {
    const category = 'Jewelry'; // Assuming 'jewelry' is the category name
    try {
        const products = await Product.find({ category }).populate("brand").exec();

        if (products.length === 0) {
            return res.status(404).send('No jewelry found');
        }

        res.render('jewelryPage', { products }); // Render products on 'jewelryPage.ejs'
    } catch (err) {
        console.error('Error fetching jewelry:', err);
        res.status(500).send('Server Error');
    }
};

// Fetch all products categorized as "Bags"
exports.getBags = async (req, res) => {
    const category = 'Bags'; // Assuming 'bags' is the category name
    try {
        const products = await Product.find({ category }).populate("brand").exec();

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
    const category = 'Wallets'; 
    try {
        const products = await Product.find({ category }).populate("brand").exec();

        if (products.length === 0) {
            return res.status(404).send('No wallets found');
        }

        res.render('walletsPage', { products }); // Render products on 'walletsPage.ejs'
    } catch (err) {
        console.error('Error fetching wallets:', err);
        res.status(500).send('Server Error');
    }
};

// Fetch all products categorized as "Accessories" with optional sorting
exports.getAccessories = async (req, res) => {
    const category = 'Accessories';
    const { order } = req.query;
    try {
        let products;
        if (order === 'asc') {
            products = await Product.find({ category }).sort({ price: 1 }).populate("brand").exec();
        } else if (order === 'desc') {
            products = await Product.find({ category }).sort({ price: -1 }).populate("brand").exec();
        } else {
            products = await Product.find({ category }).populate("brand").exec();
        }

        if (products.length === 0) {
            return res.status(404).send('No Accessories Found');
        }

        res.render('accessoriesPage', { products });
    } catch (err) {
        console.error('Error fetching accessories:', err);
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

