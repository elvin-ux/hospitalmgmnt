const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/adminModel');

const mongoURI = 'mongodb://localhost:27017/hospitalDB';

async function createAdmin() {
  await mongoose.connect(mongoURI);

  const email = 'admin@gmail.com';
  const plainPassword = 'admin@123';

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const admin = new Admin({ email, password: hashedPassword });
  await admin.save();
  console.log('Admin created successfully.');
  process.exit(0);
}

createAdmin().catch(console.error);
