// Validation for user management APIs

const validateUserUpdate = (req, res, next) => {
  const { fullName, username, isActive } = req.body;
  const errors = [];

  // Validate fullName (optional)
  if (fullName !== undefined) {
    if (typeof fullName !== 'string') {
      errors.push('Full name must be a string');
    } else if (fullName.trim().length === 0) {
      errors.push('Full name cannot be empty');
    } else if (fullName.trim().length > 100) {
      errors.push('Full name cannot exceed 100 characters');
    } else {
      req.body.fullName = fullName.trim();
    }
  }

  // Validate username (optional)
  if (username !== undefined) {
    if (typeof username !== 'string') {
      errors.push('Username must be a string');
    } else if (username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (username.trim().length > 50) {
      errors.push('Username cannot exceed 50 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.push('Username can only contain letters, numbers and underscores');
    } else {
      req.body.username = username.trim().toLowerCase();
    }
  }

  // Validate isActive (optional)
  if (isActive !== undefined) {
    if (typeof isActive !== 'boolean') {
      errors.push('Active status must be true or false');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors
    });
  }

  next();
};

module.exports = {
  validateUserUpdate
};