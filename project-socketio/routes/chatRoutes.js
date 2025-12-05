const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get all conversations
router.get('/conversations', chatController.getConversations);

// Get messages by conversation
router.get('/conversations/:conversationId/messages', chatController.getMessages);

// Create conversation
router.post('/conversations', chatController.createConversation);

module.exports = router;
