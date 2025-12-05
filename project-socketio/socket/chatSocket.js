const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const setupChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', {
      socketId: socket.id,
      userId: socket.userId,
      email: socket.userEmail,
      role: socket.userRole
    });
    
    // ==================== CHAT EVENTS ====================
    
    // Join conversation room
    socket.on('joinConversation', async (conversationId) => {
      socket.join(conversationId);
      console.log(`👤 User ${socket.userId} joined conversation ${conversationId}`);
      
      // Mark messages as read
      try {
        await Message.updateMany(
          { 
            conversationId,
            senderId: { $ne: socket.userId },
            isRead: false
          },
          { isRead: true, readAt: new Date() }
        );
        
        // Notify sender that messages were read
        socket.to(conversationId).emit('messagesRead', {
          conversationId,
          readBy: socket.userId
        });
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });
    
    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        const { conversationId, content, type = 'text' } = data;
        
        console.log('📨 New message:', {
          conversationId,
          from: socket.userName,
          content: content.substring(0, 50)
        });
        // Save to database
        const message = await Message.create({
          conversationId,
          senderId: socket.userId,
          senderName: socket.userName,
          senderAvatar: socket.userAvatar || null,
          content,
          type,
          isRead: false
        });
       
        // Update conversation lastMessage
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            content,
            senderId: socket.userId,
            timestamp: new Date()
          },
          updatedAt: new Date()
        });
        
        // Format message for client
        const messageData = {
          _id: message._id.toString(),
          conversationId: message.conversationId.toString(),
          senderId: {
            _id: message.senderId.toString(),
            name: message.senderName,
            avatar: message.senderAvatar
          },
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
          isRead: message.isRead
        };
        
        console.log('✅ Message saved, broadcasting to room:', conversationId);
        // Broadcast to all users in conversation (including sender)
        io.to(conversationId).emit('newMessage', messageData);
        
        // Emit conversation update
        io.emit('conversationUpdated', { conversationId });
        
      } catch (error) {
        console.error('❌ Send message error:', error);
        socket.emit('error', { 
          message: 'Failed to send message',
          error: error.message 
        });
      }
    });
    
    // Typing indicator
    socket.on('typing', (data) => {
      const { conversationId, isTyping } = data;
      socket.to(conversationId).emit('userTyping', {
        userId: socket.userId,
        userName: socket.userName,
        isTyping
      });
    });
    
    // Leave conversation
    socket.on('leaveConversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`👋 User ${socket.userId} left conversation ${conversationId}`);
    });
    
    // ==================== GENERAL EVENTS ====================
    
    socket.on('disconnect', (reason) => {
      console.log('❌ User disconnected:', {
        socketId: socket.id,
        userId: socket.userId,
        reason
      });
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

module.exports = setupChatSocket;
