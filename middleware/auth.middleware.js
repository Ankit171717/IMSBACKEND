const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ims_super_secret_key_123';

const authenticate = (allowedRoles = []) => (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            phone: decoded.phone,
            role: decoded.role || 'USER'
        };

        console.log(`this is token: ${JSON.stringify(decoded, null, 2)}`);
        
        if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = {
    JWT_SECRET,
    authenticate
};
