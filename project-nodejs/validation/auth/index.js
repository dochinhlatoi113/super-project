// Validation for authentication APIs

const validateRegister = (req, res, next) => {
  // Check if req.body exists (for both JSON and multipart/form-data)
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is missing. Make sure to send form data or JSON data'
    });
  }

  const { username, email, password, fullName } = req.body;
  const errors = [];

  // Validate username
  if (!username || typeof username !== 'string') {
    errors.push('Username is required');
  } else if (username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.trim().length > 50) {
    errors.push('Username cannot exceed 50 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    errors.push('Username can only contain letters, numbers and underscores');
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
    errors.push('Invalid email format');
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }

  // Validate fullName
  if (!fullName || typeof fullName !== 'string') {
    errors.push('Full name is required');
  } else if (fullName.trim().length === 0) {
    errors.push('Full name cannot be empty');
  } else if (fullName.trim().length > 100) {
    errors.push('Full name cannot exceed 100 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors
    });
  }

  // Trim and normalize data
  req.body.username = username.trim().toLowerCase();
  req.body.email = email.trim().toLowerCase();
  req.body.fullName = fullName.trim();

  next();
};

const validateLogin = (req, res, next) => {
  // Check if req.body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json'
    });
  }

  const { email, password } = req.body;
  const errors = [];

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
    errors.push('Invalid email format');
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length === 0) {
    errors.push('Password cannot be empty');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors
    });
  }

  // Normalize email
  req.body.email = email.trim().toLowerCase();
  next();
};

const validateUpdateProfile = (req, res, next) => {
  const { fullName, username } = req.body;
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

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors
    });
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  // Validate currentPassword
  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.push('Current password is required');
  }

  // Validate newPassword
  if (!newPassword || typeof newPassword !== 'string') {
    errors.push('New password is required');
  } else if (newPassword.length < 6) {
    errors.push('New password must be at least 6 characters');
  } else if (newPassword.length > 128) {
    errors.push('New password cannot exceed 128 characters');
  }

  // Check if new password is different from current password
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('New password must be different from current password');
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

const validateAdminRegister = (req, res, next) => {
  // Check if req.body exists (for both JSON and multipart/form-data)
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is missing. Make sure to send form data or JSON data'
    });
  }

  const { username, email, password, fullName, department, role } = req.body;
  const errors = [];

  // Validate username
  if (!username || typeof username !== 'string') {
    errors.push('Username is required');
  } else if (username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.trim().length > 50) {
    errors.push('Username cannot exceed 50 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    errors.push('Username can only contain letters, numbers and underscores');
  }

  // Validate email
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
    errors.push('Invalid email format');
  }

  // Validate password
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }

  // Validate fullName
  if (!fullName || typeof fullName !== 'string') {
    errors.push('Full name is required');
  } else if (fullName.trim().length === 0) {
    errors.push('Full name cannot be empty');
  } else if (fullName.trim().length > 100) {
    errors.push('Full name cannot exceed 100 characters');
  }

  // Validate department
  if (!department || typeof department !== 'string') {
    errors.push('Invalid department');
  }

  // Validate role
  if (!role || (typeof role !== 'string' && typeof role !== 'object')) {
    errors.push('Role is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data',
      errors
    });
  }

  // Trim and normalize data
  req.body.username = username.trim().toLowerCase();
  req.body.email = email.trim().toLowerCase();
  req.body.fullName = fullName.trim();
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateAdminRegister // Add export validation for admin
};