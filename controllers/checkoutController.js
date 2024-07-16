const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const mongoose = require('mongoose');




exports.getCheckout = async (req, res) => {
    try {
        const username = req.session.username;
        const userData = await User.findOne({ username });

        res.render('checkout', { username: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { country, city, street, houseNumber, zipCode, creditCardNumber, expiryMonth, expiryYear, cvv, idNumber } = req.body;
        const userId = req.session.userId;

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("userId").exec();

        if (!cart) {
            return res.status(400).send('No cart found for user.');
        }

        // Create a new order
        const newOrder = new Order({
            userId: userId,
            cart: cart._id,
            totalPrice: cart.totalPrice,
            shippingAddress: {
                country,
                city,
                street,
                houseNumber,
                zipCode,
            },
            paymentDetails: {
                creditCardNumber,
                expiryMonth,
                expiryYear,
                cvv,
                idNumber,
            },
        });

        await newOrder.save();
        res.redirect('/order-success');
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getOrderSuccess = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('cartId').exec();
        res.render('orderSuccess', { order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Internal Server Error');
    }
};