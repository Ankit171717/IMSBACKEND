const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    transactionId: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
}, {
    timestamps: true
});

subscriptionSchema.set('toJSON', {
    transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
