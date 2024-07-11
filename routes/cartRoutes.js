const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// פונקציה להוספת מוצר לסל
router.post('/add-to-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [], totalPrice: 0, numOfProducts: 0 });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    const product = await Product.findById(productId);
    const productPrice = product.discountedPrice;

    if (productIndex === -1) {
      cart.products.push({ productId, quantity: 1 });
      cart.numOfProducts += 1; // Increase numOfProducts
      cart.totalPrice += productPrice;
    } else {
      const currentQuantity = cart.products[productIndex].quantity;
      if (currentQuantity < 10) {
        cart.products[productIndex].quantity += 1;
        cart.totalPrice += productPrice;
      } else {
        return res.status(400).json({ message: 'Maximum quantity reached' });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product to cart', error });
  }
});

// פונקציה למחיקת מוצר מהעגלה
router.post('/remove-from-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex !== -1) {
      const product = await Product.findById(productId);
      const productPrice = product.discountedPrice;
      const quantity = cart.products[productIndex].quantity;

      cart.totalPrice -= productPrice * quantity;
      cart.products.splice(productIndex, 1);
      cart.numOfProducts -= 1; // Decrease numOfProducts

      await cart.save();
      return res.status(200).json({ message: 'Product removed from cart successfully' });
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove product from cart', error });
  }
});

// פונקציה לעדכון כמות מוצר בעגלה
router.post('/update-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex !== -1) {
      const product = await Product.findById(productId);
      const currentQuantity = cart.products[productIndex].quantity;
      const productPrice = product.discountedPrice;

      cart.totalPrice -= currentQuantity * productPrice;
      cart.products[productIndex].quantity = quantity;
      cart.totalPrice += quantity * productPrice;

      await cart.save();
      return res.status(200).json({ message: 'Cart updated successfully' });
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error });
  }
});

// פונקציה להצגת סל הקניות
router.get('/cart', async (req, res) => {
  const userId = req.session.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.render('cart', { products: [], totalPrice: 0, numOfProducts: 0 });
    }

    res.render('cart', { products: cart.products, totalPrice: cart.totalPrice, numOfProducts: cart.numOfProducts });
  } catch (error) {
    console.error('Failed to retrieve cart', error);
    res.status(500).send('Failed to retrieve cart');
  }
});

// פונקציה לעדכון כמות מוצר בעגלה
router.post('/update-cart', async (req, res) => {
  const userId = req.session.userId;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex !== -1) {
      const product = await Product.findById(productId);
      const currentQuantity = cart.products[productIndex].quantity;
      const productPrice = product.discountedPrice; // שימוש בפונקציה discountedPrice

      cart.totalPrice -= currentQuantity * productPrice;
      cart.products[productIndex].quantity = quantity;
      cart.totalPrice += quantity * productPrice;

      await cart.save();
      return res.status(200).json({ message: 'Cart updated successfully' });
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error });
  }
});

module.exports = router;
