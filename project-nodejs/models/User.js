const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: false,
    trim: true,
    unique: true,
    sparse: true
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    required: false
  },
  provider: {
    type: String,
    required: false
  }
});

// ...existing code...
userSchema.statics.findByRefreshToken = function(token) {
  return this.findOne({ 'refreshTokens.token': token });
};

// Lấy avatar URL
userSchema.methods.getAvatarUrl = function(req) {
  if (!this.avatar) return null;
  return `${req.protocol}://${req.get('host')}/uploads/avatars/${this.avatar}`;
};

// Ẩn thông tin nhạy cảm khi chuyển đổi sang JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

module.exports = mongoose.model('User', userSchema, 'users');