require('dotenv').config();
const mongoose = require('mongoose');
const Friend = require('../models/Friend');

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  const docs = await Friend.find().sort({createdAt:-1}).limit(50).lean();
  console.log('Found', docs.length, 'friend docs');
  docs.forEach(d=>console.log(JSON.stringify(d)));
  process.exit(0);
}

main().catch(err=>{console.error(err); process.exit(1)});
