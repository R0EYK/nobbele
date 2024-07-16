const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, default: 0 },
  numOfProducts: { type: Number, default: 0 } // Add numOfProducts field
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
