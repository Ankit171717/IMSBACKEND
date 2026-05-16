const CallLog = require('../models/callLog.model.js');
const Engineer = require('../models/engineer.model.js');
const Machine = require('../models/machine.model.js');
const Notification = require('../models/notification.model.js');
const Subscription = require('../models/subscription.model.js');
const User = require('../models/user.model.js');
const { asyncHandler, getStartOfToday, requireFields, toNumber } = require('../utils/api.js');

exports.getOverview = asyncHandler(async (_req, res) => {
    const startOfToday = getStartOfToday();
    const [totalUsers, totalEngineers, totalCallsToday] = await Promise.all([
        User.countDocuments(),
        Engineer.countDocuments(),
        CallLog.countDocuments({ calledAt: { $gte: startOfToday } })
    ]);

    res.json({ totalUsers, totalEngineers, totalCallsToday });
});

exports.getRevenue = asyncHandler(async (_req, res) => {
    const [summary] = await Subscription.aggregate([
        { $match: { status: { $in: ['ACTIVE', 'EXPIRED'] } } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
                totalTransactions: { $sum: 1 }
            }
        }
    ]);

    const recentTransactions = await Subscription.find()
        .populate('user')
        .sort({ createdAt: -1 })
        .limit(50);

    res.json({
        totalRevenue: summary ? summary.totalRevenue : 0,
        totalTransactions: summary ? summary.totalTransactions : 0,
        recentTransactions
    });
});

exports.getUsers = asyncHandler(async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
});

exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const [calls, subscriptions] = await Promise.all([
        CallLog.find({ user: user._id }).populate('engineer').sort({ calledAt: -1 }).limit(50),
        Subscription.find({ user: user._id }).sort({ createdAt: -1 })
    ]);

    res.json({ user, calls, subscriptions });
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
    requireFields(req.body, ['status']);

    if (!['ACTIVE', 'BLOCKED'].includes(req.body.status)) {
        return res.status(400).json({ message: 'status must be ACTIVE or BLOCKED' });
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
    );

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user });
});

exports.getEngineers = asyncHandler(async (_req, res) => {
    const engineers = await Engineer.find().sort({ createdAt: -1 });
    res.json({ engineers });
});

exports.getEngineerById = asyncHandler(async (req, res) => {
    const engineer = await Engineer.findById(req.params.id);
    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    const calls = await CallLog.find({ engineer: engineer._id })
        .populate('user')
        .sort({ calledAt: -1 })
        .limit(50);

    res.json({ engineer, calls });
});

exports.verifyEngineer = asyncHandler(async (req, res) => {
    requireFields(req.body, ['status']);

    if (!['VERIFIED', 'REJECTED'].includes(req.body.status)) {
        return res.status(400).json({ message: 'status must be VERIFIED or REJECTED' });
    }

    const update = {
        verificationStatus: req.body.status,
        rejectionReason: req.body.status === 'REJECTED' ? req.body.reason : undefined
    };

    const engineer = await Engineer.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true
    });

    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({ message: 'Engineer verification updated successfully', engineer });
});

exports.updateEngineerPremium = asyncHandler(async (req, res) => {
    requireFields(req.body, ['isPremium', 'feePercentage']);

    if (typeof req.body.isPremium !== 'boolean') {
        return res.status(400).json({ message: 'isPremium must be a boolean' });
    }

    const engineer = await Engineer.findByIdAndUpdate(
        req.params.id,
        {
            isPremium: req.body.isPremium,
            feePercentage: toNumber(req.body.feePercentage, 'feePercentage')
        },
        { new: true, runValidators: true }
    );

    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({ message: 'Engineer premium settings updated successfully', engineer });
});

exports.updateMachineConfig = asyncHandler(async (req, res) => {
    requireFields(req.body, ['action', 'machineName']);

    if (!['ADD', 'REMOVE'].includes(req.body.action)) {
        return res.status(400).json({ message: 'action must be ADD or REMOVE' });
    }

    if (req.body.action === 'ADD') {
        const machine = await Machine.findOneAndUpdate(
            { name: req.body.machineName },
            { name: req.body.machineName, isActive: true },
            { new: true, upsert: true, runValidators: true }
        );
        return res.status(201).json({ message: 'Machine category added successfully', machine });
    }

    const machine = await Machine.findOneAndUpdate(
        { name: req.body.machineName },
        { isActive: false },
        { new: true }
    );

    if (!machine) {
        return res.status(404).json({ message: 'Machine category not found' });
    }

    return res.json({ message: 'Machine category removed successfully', machine });
});

exports.getAllSubscriptions = asyncHandler(async (_req, res) => {
    const subscriptions = await Subscription.find()
        .populate('user')
        .sort({ createdAt: -1 });

    res.json({ subscriptions });
});

exports.broadcastNotification = asyncHandler(async (req, res) => {
    requireFields(req.body, ['target', 'title', 'body']);

    if (!['USERS', 'ENGINEERS', 'ALL'].includes(req.body.target)) {
        return res.status(400).json({ message: 'target must be USERS, ENGINEERS, or ALL' });
    }

    const notification = await Notification.create({
        target: req.body.target,
        title: req.body.title,
        body: req.body.body,
        sentBy: req.user.id
    });

    res.status(201).json({
        message: 'Notification broadcast queued successfully',
        notification
    });
});
