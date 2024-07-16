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
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate("products.productId").exec();

        if (!cart) {
            return res.status(400).send('No cart found for user.');
        }

        // Create a new order
        const newOrder = new Order({
            userId: userId,
            products: cart.products.map(product => ({
            productId: product.productId._id,
            quantity: product.quantity,
            })),
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
         // Reset the user's cart
         cart.products = [];
         cart.totalPrice = 0;
         cart.numOfProducts = 0;
         await cart.save();
        res.redirect(`/order-success/${newOrder._id}`);
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Renders the Order Completed page
exports.getOrderSuccess = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Fetch the order
        const order = await Order.findById(orderId).populate("products.productId").exec();
        if (!order) {
            return res.status(404).send('Order not found.');
        }
        console.log(order)
        // Render the EJS template with order data
        res.render('orderSuccess', { order });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.ensureOrderOwner = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send('Order not found.');
        }

        if (order.userId.toString() !== req.session.userId) {
            return res.status(403).send('You are not authorized to view this order.');
        }

        req.order = order; // Attach order to request object for further use
        next();
    } catch (error) {
        console.error('Error checking order ownership:', error);
        res.status(500).send('Internal Server Error');
    }
};