const jwt = require('jsonwebtoken');
const Engineer = require('../models/engineer.model.js');
const { JWT_SECRET } = require('../middleware/auth.middleware.js');
const { asyncHandler, requireFields } = require('../utils/api.js');

exports.sendOTP = asyncHandler(async (req, res) => {
    requireFields(req.body, ['phone']);

    res.json({
        message: 'OTP sent successfully',
        otp: '1234'
    });
});

exports.verifyOTP = asyncHandler(async (req, res) => {
    requireFields(req.body, ['phone', 'otp']);

    if (req.body.otp !== '1234') {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const engineer = await Engineer.findOne({ phone: req.body.phone });
    const token = jwt.sign(
        {
            id: engineer ? engineer._id : undefined,
            phone: req.body.phone,
            role: 'ENGINEER'
        },
        JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.json({
        message: 'Login successful',
        token,
        engineer
    });
});
