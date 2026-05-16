const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    target: { type: String, enum: ['USERS', 'ENGINEERS', 'ALL'], required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    sentBy: { type: mongoose.Schema.Types.ObjectId },
    sentAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

notificationSchema.set('toJSON', {
    transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
