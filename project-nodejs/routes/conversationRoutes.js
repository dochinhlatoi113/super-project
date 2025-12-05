const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Conversation = require('../models/Conversations');
const Admins = require('../models/Admin');
const User = require('../models/User');

// GET /api/conversations/users - Lấy danh sách tất cả users và admins để chat
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Lấy danh sách admins (không bao gồm chính mình)
    const admins = await Admins.find({
      _id: { $ne: req.user.id },
      isActive: true
    }).select('_id username email fullName avatar role').lean();

    // Lấy danh sách users
    const users = await User.find({
      isActive: true
    }).select('_id username email fullName avatar role').lean();

    // Format data để frontend dễ dùng
    const chatUsers = [
      // Admins
      ...admins.map(admin => ({
        _id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName || admin.username,
        avatar: admin.avatar,
        role: admin.role || 'admin',
        type: 'admin'
      })),
      // Users
      ...users.map(user => ({
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName || user.username,
        avatar: user.avatar,
        role: user.role || 'user',
        type: 'user'
      }))
    ];

    console.log(`📋 Found ${chatUsers.length} users/admins for chat`);

    res.json({
      success: true,
      users: chatUsers
    });

  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/conversations/create - Tạo conversation mới
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { participantId, type = 'direct' } = req.body;
    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }
    // Kiểm tra participant tồn tại
    const participant = await Admins.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }
      
    // Kiểm tra xem conversation đã tồn tại chưa (direct chat)
    if (type === 'direct') {
      const existingConversation = await Conversation.findOne({
        type: 'direct',
        'participants.userId': { $all: [req.user.id, participantId] },
        'participants': { $size: 2 }
      });

      if (existingConversation) {
        return res.json({
          success: true,
          message: 'Conversation already exists',
          conversation: {
            _id: existingConversation._id,
            participants: existingConversation.participants,
            type: existingConversation.type,
            createdAt: existingConversation.createdAt
          }
        });
      }
    }
 
    // Tạo conversation mới
    const conversation = await Conversation.create({
      participants: [
        {
          userId: req.user.id
        },
        {
          userId: participantId
        }
      ],
      type
    });

    console.log('✅ Conversation created:', conversation._id);

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      conversation: {
        _id: conversation._id,
        participants: conversation.participants,
        type: conversation.type,
        createdAt: conversation.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/conversations/my - Lấy danh sách conversations của user
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      'participants.userId': req.user.id
    })
    .populate('participants.userId', 'username email fullName avatar')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;