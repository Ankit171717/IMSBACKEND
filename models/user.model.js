const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    companyName: { type: String, trim: true },
    ownerName: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    selectedPostOffice: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    password: { type: String },
    plan: { type: String, enum: ['FREE', 'PREMIUM'], default: 'FREE' },
    subscriptionExpiresAt: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' }
}, {
    timestamps: true
});

userSchema.set('toJSON', {
    transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
