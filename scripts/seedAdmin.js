const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Admin = require('../models/admin.model.js');

dotenv.config();

const seedAdmin = async () => {
    const email = process.env.ADMIN_EMAIL || 'admin@ims.local';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.ADMIN_NAME || 'IMS Admin';

    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.findOneAndUpdate(
        { email },
        {
            $set: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        },
        { new: true, upsert: true, runValidators: true }
    );

    console.log(`Admin user ready: ${admin.email}`);
    await mongoose.disconnect();
};

seedAdmin().catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
});
