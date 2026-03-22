const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    companyName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    gstNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
