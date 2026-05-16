const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { JWT_SECRET } = require('../middleware/auth.middleware.js');
const { asyncHandler, pick, requireFields } = require('../utils/api.js');

const signUserToken = (user) => jwt.sign(
    { id: user._id, phone: user.phone, role: 'USER' },
    JWT_SECRET,
    { expiresIn: '30d' }
);

exports.register = asyncHandler(async (req, res) => {
    requireFields(req.body, [
        'companyName',
        'ownerName',
        'phone',
        'address',
        'pincode',
        'selectedPostOffice',
        'district',
        'state'
    ]);

    const payload = pick(req.body, [
        'companyName',
        'ownerName',
        'phone',
        'address',
        'pincode',
        'selectedPostOffice',
        'district',
        'state'
    ]);

    const user = await User.findOneAndUpdate(
        { phone: payload.phone },
        {
            $set: payload,
            $setOnInsert: {
                email: `${payload.phone}@ims.local`,
                plan: 'FREE',
                status: 'ACTIVE'
            }
        },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
        message: 'User registered successfully',
        token: signUserToken(user),
        user
    });
});
