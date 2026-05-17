const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN'], default: 'ADMIN' },
    status: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE' }
}, {
    timestamps: true
});

adminSchema.set('toJSON', {
    transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('Admin', adminSchema);
