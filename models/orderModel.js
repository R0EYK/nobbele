const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    shippingAddress: {
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        houseNumber: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    paymentDetails: {
        creditCardNumber: { type: String, required: true, minlength: 16, maxlength: 16 },
        expiryMonth: { type: String, required: true },
        expiryYear: { type: String, required: true },
        cvv: { type: String, required: true, minlength: 3, maxlength: 3 },
        idNumber: { type: String, required: true, minlength: 9, maxlength: 9 }
    },
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
