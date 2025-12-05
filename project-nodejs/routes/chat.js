const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { authenticate } = require('../middleware/auth');

// Get all conversations for admin
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.userId': req.user.id,
      'participants.userType': 'admin'
    })
    .sort({ 'lastMessage.timestamp': -1 })
    .populate('participants.userId', 'name email avatar');
    
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages by conversation
router.get('/conversations/:conversationId/messages', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'name avatar');
    
    // Mark as read
    await Message.updateMany(
      { 
        conversationId: req.params.conversationId,
        senderId: { $ne: req.user.id },
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message
router.post('/messages', authenticate, async (req, res) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;
    
    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      content,
      type,
      isRead: false
    });
    
    // Update conversation lastMessage
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        senderId: req.user.id,
        timestamp: new Date()
      },
      $inc: { 
        [`unreadCount.${req.user.role === 'admin' ? 'user' : 'admin'}`]: 1 
      }
    });
    
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;