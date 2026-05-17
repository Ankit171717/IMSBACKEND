const User = require('../models/user.model.js');
const { asyncHandler, pick } = require('../utils/api.js');

exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
});

// Update own profile (user)
exports.updateProfile = asyncHandler(async (req, res) => {
    const allowedFields = [
        'companyName', 'ownerName', 'gstNumber', 'address', 'city', 'selectedPostOffice',
        'district', 'state', 'pincode', 'email'
    ];

    const payload = pick(req.body, allowedFields);

    const user = await User.findByIdAndUpdate(req.user.id, payload, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        message: 'User profile updated successfully',
        user
    });
});

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
