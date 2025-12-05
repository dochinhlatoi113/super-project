const jwt = require('jsonwebtoken');

const socketAuthMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('⚠️  No token provided');
    return next(new Error('Authentication error'));
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET,{ algorithms: ["HS256"] });
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    socket.userName = decoded.fullName || decoded.username || decoded.name;
    socket.userRole = decoded.role || 'user';
    console.log('✅ User authenticated:', {
      id: socket.userId,
      email: socket.userEmail,
      role: socket.userRole
    });
    
    next();
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    next(new Error('Authentication error'));
  }
};

module.exports = socketAuthMiddleware;
