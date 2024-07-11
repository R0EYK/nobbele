const User = require('../models/userModel');
const session = require('express-session');

// Function to render our login.ejs page
exports.getLogin = (req, res) => {
  res.render('login');
};
// Function to logout (destroy the session created for the user)
exports.logout = (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.log(err);
          res.status(500).send('Logout failed');
      } else {
          res.redirect('/');
      }
  });
};
// Function to post the login form and check in DB
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('Invalid username');
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    // Ensure req.session is defined before setting properties
    if (!req.session) {
      throw new Error('Session not initialized');
    }

    // Set session variables
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.loggedIn = true;

    // Redirect to the home page
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
};

exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    return res.redirect('/');
  }
  next();
};
// Check if someone is authenticated and if he isn`t it wont let him access.
exports.isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {  // Assuming you use sessions for authentication
      next();  // User is authenticated, proceed to the next middleware/route handler
  } else {
      res.redirect('/login');  // Redirect to login if not authenticated
  }
};