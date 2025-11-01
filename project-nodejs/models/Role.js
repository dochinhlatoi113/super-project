const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['superadmin', 'vipadmin', 'admin']
  },
  description: { type: String, required: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  hierarchy: { type: Number, required: true }, // superadmin: 3, vipadmin: 2, admin: 1
  isActive: { type: Boolean, default: true },
  deleted_at: { type: Date, default: null }
}, {
  timestamps: true
});

// Index for faster queries
roleSchema.index({ name: 1 });
roleSchema.index({ hierarchy: -1 });

module.exports = mongoose.model('Role', roleSchema);