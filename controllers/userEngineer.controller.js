const mongoose = require('mongoose');
const Engineer = require('../models/engineer.model.js');
const Subscription = require('../models/subscription.model.js');
const User = require('../models/user.model.js');
const { asyncHandler } = require('../utils/api.js');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeSearchValue = (value) => (typeof value === 'string' ? value.trim() : value);
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const maskPhone = (phone = '') => {
    if (phone.length <= 4) {
        return phone;
    }
    return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
};

const canViewEngineerPhone = async (userId) => {
    if (!isValidObjectId(userId)) {
        return false;
    }

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
    const city = normalizeSearchValue(req.body?.city ?? req.query?.city);
    const machineType = normalizeSearchValue(req.body?.machineType ?? req.query?.machineType);
    const query = {
        status: 'ACTIVE',
        verificationStatus: 'VERIFIED'
    };

    if (city) {
        query.location = { $regex: escapeRegex(city), $options: 'i' };
    }

    if (machineType) {
        query.selectedMachines = { $regex: escapeRegex(machineType), $options: 'i' };
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
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid engineer id format' });
    }

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
