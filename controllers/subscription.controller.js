const Subscription = require('../models/subscription.model.js');
const User = require('../models/user.model.js');
const { asyncHandler, requireFields } = require('../utils/api.js');
const { findPlan, subscriptionPlans } = require('../utils/subscriptionPlans.js');

exports.getStatus = asyncHandler(async (req, res) => {
    const activeSubscription = await Subscription.findOne({
        user: req.user.id,
        status: 'ACTIVE',
        expiresAt: { $gt: new Date() }
    }).sort({ expiresAt: -1 });

    res.json({
        canViewEngineerNumbers: Boolean(activeSubscription),
        plan: activeSubscription ? 'PREMIUM' : 'FREE',
        subscription: activeSubscription
    });
});

exports.getPlans = asyncHandler(async (_req, res) => {
    res.json({ plans: subscriptionPlans });
});

exports.purchase = asyncHandler(async (req, res) => {
    requireFields(req.body, ['planId', 'paymentMethod', 'transactionId']);

    const plan = findPlan(req.body.planId);
    if (!plan) {
        return res.status(404).json({ message: 'Subscription plan not found' });
    }

    const startsAt = new Date();
    const expiresAt = new Date(startsAt);
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    const subscription = await Subscription.create({
        user: req.user.id,
        planId: plan.planId,
        paymentMethod: req.body.paymentMethod,
        transactionId: req.body.transactionId,
        amount: plan.price,
        startsAt,
        expiresAt
    });

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { plan: 'PREMIUM', subscriptionExpiresAt: expiresAt },
        { new: true }
    );

    res.status(201).json({
        message: 'Subscription purchased successfully',
        subscription,
        user
    });
});
