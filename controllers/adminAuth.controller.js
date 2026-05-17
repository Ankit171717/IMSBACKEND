const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model.js');
const { JWT_SECRET } = require('../middleware/auth.middleware.js');
const { asyncHandler, requireFields } = require('../utils/api.js');

const signAdminToken = (admin) => jwt.sign(
    { id: admin._id, email: admin.email, role: 'ADMIN' },
    JWT_SECRET,
    { expiresIn: '30d' }
);

exports.login = asyncHandler(async (req, res) => {
    requireFields(req.body, ['email', 'password']);

    const admin = await Admin.findOne({ email: req.body.email.toLowerCase() });
    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (admin.status !== 'ACTIVE') {
        return res.status(403).json({ message: 'Admin account is blocked' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
        message: 'Admin login successful',
        token: signAdminToken(admin),
        admin
    });
});
