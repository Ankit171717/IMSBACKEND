const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
        const { companyName, ownerName, gstNumber, address, city, state, pincode, phone, email, password, confirmPassword } = req.body;

        // 1. Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new user
        const newUser = new User({
            companyName,
            ownerName,
            gstNumber,
            address,
            city,
            state,
            pincode,
            phone,
            email,
            password: hashedPassword
        });

        // 5. Save user to DB
        await newUser.save();

        // 6. Return response (excluding password)
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ 
            message: "Registration successful", 
            user: userResponse 
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
