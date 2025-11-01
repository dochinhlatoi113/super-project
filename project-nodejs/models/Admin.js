const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  avatar: { type: String, default: null },
  avatarUrl: { type: String, default: null },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: { type: Boolean, default: true },
  refreshTokens: [{ type: String }],
  deleted_at: { type: Date, default: null }
}, {
  timestamps: true
});

// Hash password before save
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add refresh token
adminSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push(token);
  return this.save();
};

// Remove refresh token
adminSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t !== token);
  return this.save();
};

// Remove all refresh tokens
adminSchema.methods.removeAllRefreshTokens = function() {
  this.refreshTokens = [];
  return this.save();
};

// Find admin by refresh token
adminSchema.statics.findByRefreshToken = function(token) {
  return this.findOne({ refreshTokens: token });
};

module.exports = mongoose.model('Admin', adminSchema);