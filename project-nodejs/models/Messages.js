const mongoose = require('mongoose');
const { Schema } = mongoose;
const messageSchema = new Schema({ 
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String }, 
    type: { type: String, enum: ['text', 'image', 'file', 'audio'], default: 'text' },
    attachments: [{
        url: { type: String },
        filename: { type: String },
        size: { type: Number },
        mimeType: { type: String }
    }],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date }
}, {
    timestamps: true
});
module.exports = mongoose.model('Message', messageSchema);