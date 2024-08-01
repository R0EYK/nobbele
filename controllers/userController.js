const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

const { registerUser, loginUser } = require('./authController');

//Render Login / register pages
exports.getSignup = async(req , res) =>{
  res.render('signup');
};
// Post signup
exports.postSignup = async (req, res) => {
  try {
    const { firstName, lastName, username, password, email } = req.body;

    // Create a new user
    const user = new User({ firstName, lastName, username, password, email });
    await user.save();

    // Redirect to the login page after successful signup
    res.redirect('/login');
  } catch (error) {
    // Handle specific errors (e.g., validation errors)
    if (error.name === 'ValidationError') {
      return res.status(400).send('Validation error: ' + error.message);
    }

    // Handle general errors
    res.status(500).send('Error signing up: ' + error.message);
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.session.userId;

  try {
      // Fetch all orders for the current user
      const orders = await Order.find({ userId }).sort({ orderDate: -1 }).populate("products.productId").exec();

      if (orders.length === 0) {
          return res.render('myOrders', {orders , message: 'You have no orders yet.' });
      }

      res.render('myOrders', { orders });
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).send('Failed to fetch orders');
  }
};

exports.changePasswordPage = (req, res) => {
  res.render('changePassword' , {errorMessages:{}}); 
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.session.userId;

  try {
      // Check if any required fields are empty
      if (!currentPassword || !newPassword || !confirmPassword) {
          return res.render('changePassword', {
              errorMessages: { general: 'Please fill in all fields' }
          });
      }

      // Check if newPassword is at least 6 characters long
      if (newPassword.length < 6) {
          return res.render('changePassword', {
              errorMessages: { newPassword: 'New password must be at least 6 characters long' }
          });
      }

      // Fetch the user from the database
      const user = await User.findById(userId);

      // Validate that newPassword and confirmPassword match
      if (newPassword !== confirmPassword) {
          return res.render('changePassword', {
              errorMessages: { confirmPassword: 'Passwords do not match' }
          });
      }

      // Validate current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
          return res.render('changePassword', {
              errorMessages: { currentPassword: 'Current password is incorrect' }
          });
      }

      // Update user's password
      user.password = newPassword;
      await user.save();

      // Redirect or render success message
      res.redirect('/'); // Example redirect after successful password change
  } catch (error) {
      res.status(500).send('Error changing password: ' + error.message);
  }
};
