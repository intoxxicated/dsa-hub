const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'admin';
            existingAdmin.password = 'admin@1234'; // This will be hashed by the pre-save hook
            await existingAdmin.save();
            console.log('Admin user updated');
        } else {
            const admin = new User({
                email: adminEmail,
                password: 'admin@1234',
                full_name: 'Admin User',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
