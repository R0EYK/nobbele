// controllers/authController.js
const User = require('../models/userModel');

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }

    res.send('User logged in successfully!');
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
};
