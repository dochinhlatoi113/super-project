const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }
    
    const conversations = await Conversation.find({
      'participants.userId': userId
    }).sort({ updatedAt: -1 });
    
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages by conversation
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });
    
    // Mark as read
    await Message.updateMany(
      { 
        conversationId: req.params.conversationId,
        isRead: false
      },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create conversation
exports.createConversation = async (req, res) => {
  try {
    const { participants, assignedAdmin } = req.body;
    
    const conversation = await Conversation.create({
      participants,
      status: 'active',
      assignedAdmin
    });
    
    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
