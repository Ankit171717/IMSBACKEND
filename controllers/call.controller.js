const CallLog = require('../models/callLog.model.js');
const Engineer = require('../models/engineer.model.js');
const { asyncHandler, getStartOfToday, requireFields, toNumber } = require('../utils/api.js');

exports.logUserCall = asyncHandler(async (req, res) => {
    requireFields(req.body, ['engineerId', 'duration']);

    const engineer = await Engineer.findById(req.body.engineerId);
    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    const callLog = await CallLog.create({
        user: req.user.id,
        engineer: engineer._id,
        duration: toNumber(req.body.duration, 'duration')
    });

    res.status(201).json({
        message: 'Call logged successfully',
        callLog
    });
});

exports.getUserCallHistory = asyncHandler(async (req, res) => {
    const startOfToday = getStartOfToday();

    const [today, recent] = await Promise.all([
        CallLog.find({ user: req.user.id, calledAt: { $gte: startOfToday } })
            .populate('engineer')
            .sort({ calledAt: -1 }),
        CallLog.find({ user: req.user.id })
            .populate('engineer')
            .sort({ calledAt: -1 })
            .limit(50)
    ]);

    res.json({ today, recent });
});

exports.getEngineerCallHistory = asyncHandler(async (req, res) => {
    const calls = await CallLog.find({ engineer: req.user.id })
        .populate('user')
        .sort({ calledAt: -1 })
        .limit(100);

    res.json({ calls });
});
