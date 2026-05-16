const mongoose = require('mongoose');

const engineerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    skills: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    visitCharge: { type: Number, required: true, min: 0 },
    selectedMachines: [{ type: String, trim: true }],
    location: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    isOnline: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED'],
        default: 'PENDING'
    },
    rejectionReason: { type: String, trim: true },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' },
    isPremium: { type: Boolean, default: false },
    feePercentage: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }
}, {
    timestamps: true
});

engineerSchema.virtual('isVerified').get(function () {
    return this.verificationStatus === 'VERIFIED';
});

engineerSchema.set('toJSON', {
    virtuals: true,
    transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Engineer', engineerSchema);
