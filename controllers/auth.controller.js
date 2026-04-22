const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret for JWT - in production, this should be in .env
const JWT_SECRET = process.env.JWT_SECRET || 'ims_super_secret_key_123';

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

exports.sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required" });
        }

        // Static OTP for testing as requested
        const staticOTP = "1234";

        res.status(200).json({
            message: "OTP sent successfully",
            otp: staticOTP // Returning OTP just for demonstration as requested
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }

        // Verify static OTP
        if (otp !== "1234") {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Find or create user by phone
        let user = await User.findOne({ phone });
        
        if (!user) {
            // Create a dummy user if they don't exist yet, 
            // since this is a direct login by number
            user = new User({
                companyName: "Default Company",
                ownerName: "User",
                phone: phone,
                email: `${phone}@example.com`, // dummy email since it's required
                password: await bcrypt.hash("default123", 10) // dummy password
            });
            await user.save();
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, phone: user.phone },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: "Login successful",
            token,
            user: userResponse
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
