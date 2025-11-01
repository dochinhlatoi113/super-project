const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    enum: ['View', 'Edit', 'Delete', 'Update', 'Show', 'Create'] 
  },
  description: { type: String, default: '' },
  deleted_at: { type: Date, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('Permission', permissionSchema);