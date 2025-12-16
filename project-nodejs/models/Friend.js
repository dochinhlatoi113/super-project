const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  }
}, {
  timestamps: true
});

friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

friendSchema.pre('save', function(next) {
  if (this.userId && this.friendId && this.userId.equals && this.userId.equals(this.friendId)) {
    return next(new Error('Cannot add yourself as a friend'));
  }
  next();
});

module.exports = mongoose.model('Friend', friendSchema);
