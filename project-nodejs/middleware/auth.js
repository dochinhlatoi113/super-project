const passport = require('passport');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi xác thực token' 
      });
    }
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc đã hết hạn' 
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

const authenticateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'Refresh token không được cung cấp' 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    req.refreshTokenPayload = decoded;
    req.refreshToken = refreshToken;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token has expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid refresh token' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Server error during refresh token validation' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user is admin (has role)
  if (!req.user.role || !['superadmin', 'vipadmin', 'admin'].includes(req.user.role.name || req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if ((req.user.role?.name || req.user.role) !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Superadmin access required'
    });
  }
  next();
};

const requireVipOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const roleName = req.user.role?.name || req.user.role;
  if (!['vipadmin', 'superadmin'].includes(roleName)) {
    return res.status(403).json({
      success: false,
      message: 'Vipadmin or superadmin access required'
    });
  }

  next();
};


const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Server error during token validation' 
      });
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

// Middleware to check permission assignment (only admin can do this)
const assignPermissions = (req, res, next) => {
  if (!req.user || !req.user.role || !['superadmin', 'vipadmin', 'admin'].includes(req.user.role.name || req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only admin can assign permissions to users'
    });
  }
  const { permissions } = req.body;
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid permissions list'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  requireAdmin,
  requireSuperAdmin,
  requireVipOrSuperAdmin,
  optionalAuth,
  assignPermissions
};