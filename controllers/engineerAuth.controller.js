const jwt = require('jsonwebtoken');
const Engineer = require('../models/engineer.model.js');
const { JWT_SECRET } = require('../middleware/auth.middleware.js');
const { asyncHandler, pick, requireFields, toNumber } = require('../utils/api.js');

const signEngineerToken = (engineer) => jwt.sign(
    { id: engineer._id, phone: engineer.phone, role: 'ENGINEER' },
    JWT_SECRET,
    { expiresIn: '30d' }
);

exports.register = asyncHandler(async (req, res) => {
    requireFields(req.body, [
        'name',
        'phone',
        'email',
        'skills',
        'experience',
        'visitCharge',
        'selectedMachines',
        'location',
        'address'
    ]);

    if (!Array.isArray(req.body.selectedMachines) || req.body.selectedMachines.length === 0) {
        return res.status(400).json({ message: 'selectedMachines must be a non-empty array' });
    }

    const payload = pick(req.body, [
        'name',
        'phone',
        'email',
        'skills',
        'selectedMachines',
        'location',
        'address'
    ]);

    payload.experience = toNumber(req.body.experience, 'experience');
    payload.visitCharge = toNumber(req.body.visitCharge, 'visitCharge');
    payload.verificationStatus = 'PENDING';

    const engineer = await Engineer.findOneAndUpdate(
        { phone: payload.phone },
        { $set: payload, $setOnInsert: { isOnline: false, status: 'ACTIVE' } },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
        message: 'Engineer registered successfully',
        token: signEngineerToken(engineer),
        engineer
    });
});
