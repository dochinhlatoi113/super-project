const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({
  participants: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }
  ],
  type: { type: String, enum: ['direct', 'group'], default: 'direct' },
  lastMessage: {
    content: { type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date }
  },
  status: { type: String, enum: ['active', 'waiting', 'closed'], default: 'active' },
  assignedAdmin: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
