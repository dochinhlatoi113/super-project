require('dotenv').config();
const mongoose = require('mongoose');
// ensure models are registered
require('../models/Admin');
const Friend = require('../models/Friend');

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const docs = await Friend.find()
    .sort({createdAt:-1})
    .limit(10)
    .populate('userId', 'username email fullName')
    .populate('friendId', 'username email fullName')
    .lean();

  console.log('Found', docs.length, 'friend docs (populated)');
  docs.forEach(d=>{
    console.log('---');
    console.log('id:', d._id);
    console.log('status:', d.status);
    console.log('requestedAt:', d.requestedAt);
    console.log('user (requester):', d.userId ? {id: d.userId._id, fullName: d.userId.fullName, email: d.userId.email} : d.userId);
    console.log('friend (target):', d.friendId ? {id: d.friendId._id, fullName: d.friendId.fullName, email: d.friendId.email} : d.friendId);
  });

  process.exit(0);
}

main().catch(err=>{console.error(err); process.exit(1)});
