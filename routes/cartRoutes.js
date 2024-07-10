const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// פונקציה להוספת מוצר לסל
router.post('/add-to-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [], totalPrice: 0 });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    const product = await Product.findById(productId);
    const productPrice = product.price * quantity;

    if (productIndex === -1) {
      cart.products.push({ productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    // עדכון המחיר הכולל של העגלה
    cart.totalPrice += productPrice;

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
});

// פונקציה להצגת סל הקניות
router.get('/cart', async (req, res) => {
  const userId = req.session.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.render('cart', { products: [], totalPrice: 0 });
    }

    res.render('cart', { products: cart.products, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error('Failed to retrieve cart', error);
    res.status(500).send('Failed to retrieve cart');
  }
});

// פונקציה למחיקת מוצר מהסל
router.post('/remove-from-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    const product = await Product.findById(productId);
    const productPrice = product.price * cart.products[productIndex].quantity;

    // הסרת המוצר מהעגלה
    cart.products.splice(productIndex, 1);

    // עדכון המחיר הכולל של העגלה
    cart.totalPrice -= productPrice;

    await cart.save();
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Failed to remove product from cart', error);
    res.status(500).json({ message: 'Failed to remove product from cart', error });
  }
});

module.exports = router;
