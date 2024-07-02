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
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex'],
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
