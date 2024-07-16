const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Function to add product to cart
router.post('/add-to-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      cart.products.push({ productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
});

// Function to display shopping cart with total price calculation
router.get('/cart', async (req, res) => {
  const userId = req.session.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart || cart.products.length === 0) {
      return res.render('cart', { products: [], total: 0 });
    }

    let totalPrice = 0;
    for (const product of cart.products) {
      totalPrice += product.productId.price * product.quantity;
    }

    res.render('cart', { products: cart.products, total: totalPrice });
  } catch (error) {
    console.error('Failed to retrieve cart', error);
    res.status(500).send('Failed to retrieve cart');
  }
});

module.exports = router;
