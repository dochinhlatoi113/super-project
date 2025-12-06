const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversations');
const Message = require('../models/Messages');
const Admin = require('../models/Admin');
const { authenticateToken: authenticate, requireAdmin } = require('../middleware/auth');

// Get all conversations for admin
router.get('/conversations', authenticate, requireAdmin, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.userId': req.user.id,
      'participants.userType': 'admin'
    })
    .sort({ 'lastMessage.timestamp': -1 })
    .populate('participants.userId', 'username email avatar fullName');

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get messages by conversation
router.get('/conversations/:conversationId/messages', authenticate, requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'username avatar fullName');

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
router.post('/messages', authenticate, requireAdmin, async (req, res) => {
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
        'unreadCount.user': 1
      }
    });

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all admin users for adding friends
router.get('/get-all-admin-chat', authenticate, requireAdmin, async (req, res) => {
  try {
    const { searchQuery } = req.query;

    // Tạo filter mặc định
    let filter = { isActive: true };

    // Nếu có search
    if (searchQuery && searchQuery.trim() !== '') {
      const regex = new RegExp(searchQuery, 'i'); // ignore case

      filter.$or = [
        { username: regex },
        { email: regex },
        { fullName: regex }
      ];
    }

    // Lấy admin
    const admins = await Admin.find(filter)
      .select('_id username email fullName avatar role')
      .populate('role', 'name email') // thêm name để lấy role.name
      .sort({ fullName: 1 });

    // Format response
    const formattedAdmins = admins.map(admin => ({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      avatar: admin.avatar,
      role: admin.role?.name || 'admin',
      type: 'admin'
    }));

    return res.json({
      success: true,
      users: formattedAdmins
    });

  } catch (error) {
    console.error('Get all admin error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


// Create conversation with another admin
router.post('/conversations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if participant exists and is admin
    const participant = await Admin.findById(participantId);
    if (!participant || !participant.isActive) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      'participants.userId': { $all: [req.user.id, participantId] },
      'participants.userType': 'admin'
    });

    if (existingConversation) {
      return res.json({ success: true, data: existingConversation });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [
        { userId: req.user.id, userType: 'admin' },
        { userId: participantId, userType: 'admin' }
      ],
      unreadCount: {
        admin: 0,
        user: 0
      }
    });

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;