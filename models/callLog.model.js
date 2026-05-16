const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    engineer: { type: mongoose.Schema.Types.ObjectId, ref: 'Engineer', required: true, index: true },
    duration: { type: Number, required: true, min: 0 },
    calledAt: { type: Date, default: Date.now, index: true }
}, {
    timestamps: true
});

callLogSchema.set('toJSON', {
    transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('CallLog', callLogSchema);
