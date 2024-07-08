const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel'); // נתיב נכון לקובץ
const Product = require('../models/productModel');
const User = require('../models/userModel');

// פונקציה להוספת מוצר לסל
router.post('/add-to-cart', async (req, res) => {
  const userId = req.session.userId; // קבלת מזהה המשתמש מהסשן
  const { productId, quantity } = req.body; // קבלת מזהה המוצר וכמות מהבקשה

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

// פונקציה להצגת סל הקניות
router.get('/cart', async (req, res) => {
  const userId = req.session.userId; // קבלת מזהה המשתמש מהסשן

  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.render('cart', { products: [] }); // תצוגת עמוד הקניות עם מערך ריק אם אין מוצרים בסל
    }

    res.render('cart', { products: cart.products }); // תצוגת עמוד הקניות עם רשימת המוצרים בסל
  } catch (error) {
    console.error('Failed to retrieve cart', error);
    res.status(500).send('Failed to retrieve cart'); // שגיאה במקרה של בעיה בשליפת הסל
  }
});

module.exports = router;
