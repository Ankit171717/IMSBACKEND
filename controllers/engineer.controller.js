const Engineer = require('../models/engineer.model.js');
const { asyncHandler, pick, requireFields, toNumber } = require('../utils/api.js');

exports.getProfile = asyncHandler(async (req, res) => {
    const engineer = await Engineer.findById(req.user.id);

    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({ engineer });
});

exports.updateProfile = asyncHandler(async (req, res) => {
    requireFields(req.body, ['skills', 'experience', 'visitCharge', 'selectedMachines']);

    if (!Array.isArray(req.body.selectedMachines) || req.body.selectedMachines.length === 0) {
        return res.status(400).json({ message: 'selectedMachines must be a non-empty array' });
    }

    const payload = pick(req.body, ['skills', 'selectedMachines']);
    payload.experience = toNumber(req.body.experience, 'experience');
    payload.visitCharge = toNumber(req.body.visitCharge, 'visitCharge');

    const engineer = await Engineer.findByIdAndUpdate(req.user.id, payload, {
        new: true,
        runValidators: true
    });

    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({
        message: 'Engineer profile updated successfully',
        engineer
    });
});

exports.updateStatus = asyncHandler(async (req, res) => {
    requireFields(req.body, ['isOnline']);

    if (typeof req.body.isOnline !== 'boolean') {
        return res.status(400).json({ message: 'isOnline must be a boolean' });
    }

    const engineer = await Engineer.findByIdAndUpdate(
        req.user.id,
        { isOnline: req.body.isOnline },
        { new: true, runValidators: true }
    );

    if (!engineer) {
        return res.status(404).json({ message: 'Engineer not found' });
    }

    res.json({
        message: 'Engineer status updated successfully',
        engineer
    });
});
