const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_management');
    
    const adminExists = await Admin.findOne({ email: 'admin@hospital.com' });
    
    if (!adminExists) {
      await Admin.create({
        name: 'System Admin',
        email: 'admin@hospital.com',
        password: 'admin123'
      });
      console.log('Default admin user created: admin@hospital.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createAdmin();