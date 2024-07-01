const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb+srv://roeyk70:123ad123ad@nobbele.9nzlam0.mongodb.net/mydatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve home.html on root path
const viewsPath = path.join(__dirname, 'Views', 'home.html');
app.get('/', (req, res) => {
    res.sendFile(viewsPath);
});

// Serve addProduct.html
app.get('/addProduct', (req, res) => {
    const addProductPath = path.join(__dirname, 'Views', 'addProduct.html');
    res.sendFile(addProductPath);
});

// Routes
app.use('/products', productRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
