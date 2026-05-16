const Engineer = require('../models/engineer.model.js');
const Subscription = require('../models/subscription.model.js');
const User = require('../models/user.model.js');
const { asyncHandler, requireFields } = require('../utils/api.js');

const maskPhone = (phone = '') => {
    if (phone.length <= 4) {
        return phone;
    }
    return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
};

const canViewEngineerPhone = async (userId) => {
    const user = await User.findById(userId);
    if (!user || user.status !== 'ACTIVE') {
        return false;
    }

    if (user.plan === 'PREMIUM' && (!user.subscriptionExpiresAt || user.subscriptionExpiresAt > new Date())) {
        return true;
    }

    const activeSubscription = await Subscription.exists({
        user: userId,
        status: 'ACTIVE',
        expiresAt: { $gt: new Date() }
    });

    return Boolean(activeSubscription);
};

const serializeEngineerForUser = (engineer, canViewPhone) => {
    const data = engineer.toJSON();
    data.phone = canViewPhone ? data.phone : maskPhone(data.phone);
    return data;
};

exports.searchEngineers = asyncHandler(async (req, res) => {
    requireFields(req.body, ['machineType', 'size', 'engineerType', 'latitude', 'longitude']);

    const { machineType, engineerType } = req.body;
    const query = {
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED',
        selectedMachines: machineType
    };

    if (engineerType) {
        query.skills = { $regex: engineerType, $options: 'i' };
    }

    const engineers = await Engineer.find(query)
        .sort({ isPremium: -1, isOnline: -1, rating: -1, createdAt: -1 })
        .limit(50);

    const canViewPhone = await canViewEngineerPhone(req.user.id);

    res.json({
        count: engineers.length,
        engineers: engineers.map((engineer) => serializeEngineerForUser(engineer, canViewPhone))
    });
});

exports.getEngineerById = asyncHandler(async (req, res) => {
    const engineer = await Engineer.findOne({
        _id: req.params.id,
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED'
    });

    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    const canViewPhone = await canViewEngineerPhone(req.user.id);
    res.json({ engineer: serializeEngineerForUser(engineer, canViewPhone) });
});

exports.canViewEngineerPhone = canViewEngineerPhone;
