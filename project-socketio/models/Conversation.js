const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    userType: {
      type: String,
      enum: ['admin', 'user'],
      required: true
    },
    name: String,
    email: String,
    avatar: String
  }],
  lastMessage: {
    content: String,
    senderId: mongoose.Schema.Types.ObjectId,
    timestamp: Date
  },
  status: {
    type: String,
    enum: ['active', 'waiting', 'closed'],
    default: 'active'
  },
  assignedAdmin: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
