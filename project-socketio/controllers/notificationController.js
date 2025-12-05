// Broadcast notification to all connected Socket.IO clients
exports.broadcastNotification = (req, res) => {
  try {
    const { event, data } = req.body;
    
    if (!event || !data) {
      return res.status(400).json({
        success: false,
        message: 'Missing event or data'
      });
    }
    
    console.log('📢 Broadcasting notification:', event, data);
    
    // Get io instance from app
    const io = req.app.get('io');
    
    if (!io) {
      return res.status(500).json({
        success: false,
        message: 'Socket.IO not initialized'
      });
    }
    
    // Broadcast to all connected clients
    io.emit(event, data);
    
    res.json({
      success: true,
      message: 'Notification broadcasted successfully'
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
