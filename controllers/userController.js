// controllers/userController.js
const User = require('../models/userModel');

exports.getSignup = (req, res) => {
  res.render('signup');
};

exports.postSignup = async (req, res) => {
  try {
    const { firstName, lastName, username, password, email } = req.body;
    const user = new User({ firstName, lastName, username, password, email });
    await user.save();
    res.send('User signed up successfully!');
  } catch (error) {
    res.status(400).send('Error signing up: ' + error.message);
  }
};
