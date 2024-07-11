const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
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




