require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Friend = require('../models/Friend');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const admins = await Admin.find({ isActive: true }).limit(2).lean();
  if (!admins || admins.length < 2) {
    console.error('Need at least 2 admin documents in DB to run this test');
    process.exit(1);
  }

  const [user, friend] = admins;
  console.log('Using user:', user._id.toString(), 'friend:', friend._id.toString());

  try {
    const exists = await Friend.findOne({ $or: [ { userId: user._id, friendId: friend._id }, { userId: friend._id, friendId: user._id } ] });
    if (exists) {
      console.log('Friend request or friendship already exists:', exists._id.toString());
      process.exit(0);
    }

    const newReq = new Friend({ userId: user._id, friendId: friend._id, status: 'pending' });
    const saved = await newReq.save();
    console.log('Saved friend request:', saved._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Error creating friend request:', err);
    process.exit(1);
  }
}

main();
