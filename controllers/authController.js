const User = require('../models/userModel');
const session = require('express-session');


exports.getLogin = (req, res) => {
  res.render('login');
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out: ' + err.message);
    }
    res.redirect('/login'); // Redirect to login page after logout
  });
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

    // Ensure req.session is defined before setting properties
    if (!req.session) {
      throw new Error('Session not initialized');
    }

    // Set session variables
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.loggedIn = true;

    res.send('User logged in successfully!');
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
};

exports.checkLoggedIn = (req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn || false;
  next();
};