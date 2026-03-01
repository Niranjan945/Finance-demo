// src/utils/seedAdmin.js
const User = require('../models/user');

const seedAdmin = async () => {
  try {
    const adminEmail = 'niranjan023a@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      // THE FIX: Check if they exist but are stuck as a USER
      if (adminExists.role !== 'ADMIN') {
        adminExists.role = 'ADMIN';
        await adminExists.save();
        console.log('🚀 Existing user found. Upgraded their role to ADMIN!');
      } else {
        console.log('✅ Admin user already exists and has correct privileges.');
      }
      return;
    }

    // If no user exists at all, create a fresh one
    await User.create({
      name: 'Avula Niranjan Reddy',
      email: adminEmail,
      password: 'admin@**1234',     // Change this in production
      role: 'ADMIN'
    });

    console.log('🎉 Admin user seeded successfully!');
    console.log('   Email    : niranjan023a@gmail.com');
    console.log('   Password : admin@**1234');
  } catch (error) {
    console.error('❌ Seed Admin Error:', error.message);
  }
};

module.exports = seedAdmin;