const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const Cart = require('./models/cartModel'); // Adjust the path as per your project structure
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Use express-session middleware
app.use(session({
    secret: 'random-key', // (used to sign the session ID cookie)
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Session expiry time (e.g., 1 day)
    }
  }));

  // Middleware to pass loggedIn status to all views
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn || false;
    res.locals.username = req.session.username || '';
    res.locals.userId = req.session.userId || '';
    next();
  });

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MongoDB Connection
mongoose.connect('mongodb+srv://roeyk70:123ad123ad@nobbele.9nzlam0.mongodb.net/mydatabase?retryWrites=true&w=majority', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
// Serve static files from 'public' directory
app.use(express.static('public'));
// Example route rendering home.ejs
app.get('/', async (req, res) => {
  try {
    if (req.session.loggedIn) {
      // If user is logged in, fetch numOfProducts from cart
      const userId = req.session.userId;
      const cart = await Cart.findOne({ userId });

      let numOfProducts = 0;
      if (cart) {
        numOfProducts = cart.numOfProducts;
      }

      res.render('home', { numOfProducts, loggedIn: true });
    } else {
      // If user is not logged in
      res.render('home', { loggedIn: false });
    }
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.render('home', { numOfProducts: 0, loggedIn: false });
  }
});
// Serve addProduct.html , DONT FORGET TO REMOVE!!!!!
app.get('/addProduct', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'addProduct.html'));
});
// Routes
app.use('/products', productRoutes);
app.use('/brands', brandRoutes); 
app.use(userRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/order-success' , checkoutRoutes)





// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
