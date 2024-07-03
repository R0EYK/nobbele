const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: [String], // Array of strings for multiple images
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex'],
        required: true
    },

    category: {
        type: String,
        enum: ['Bags', 'Wallets', 'Accessories', 'Jewelry'], // Restrict to these values
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
