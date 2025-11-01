const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  // Generate tokens
  generateTokens(user) {
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        token: jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET)
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // Register new user
  async register(userData) {
    const { username, email, password, fullName, avatar } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw new Error('EMAIL_EXISTS');
      }
      if (existingUser.username === username.toLowerCase()) {
        throw new Error('USERNAME_EXISTS');
      }
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      fullName,
      avatar: avatar || null
    });

    await newUser.save();

    // Generate tokens
    const tokens = this.generateTokens(newUser);

    // Save refresh token to database
    await newUser.addRefreshToken(tokens.refreshToken);

    return {
      user: newUser,
      tokens
    };
  }

  // Login
  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new Error('ACCOUNT_DISABLED');
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error('INVALID_PASSWORD');
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Save refresh token to database
    await user.addRefreshToken(tokens.refreshToken);

    return {
      user,
      tokens
    };
  }

  // Refresh token
  async refreshToken(refreshToken, userId) {
    // Find user with this refresh token
    const user = await User.findByRefreshToken(refreshToken);

    if (!user || user._id.toString() !== userId) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    if (!user.isActive) {
      throw new Error('ACCOUNT_DISABLED');
    }

    // Remove old refresh token
    await user.removeRefreshToken(refreshToken);

    // Generate new tokens
    const tokens = this.generateTokens(user);

    // Save new refresh token
    await user.addRefreshToken(tokens.refreshToken);

    return tokens;
  }

  // Logout
  async logout(user, refreshToken) {
    if (refreshToken) {
      await user.removeRefreshToken(refreshToken);
    }
    return true;
  }

  // Logout all devices
  async logoutAll(user) {
    await user.removeAllRefreshTokens();
    return true;
  }

  // Update profile information
  async updateProfile(user, updateData) {
    const { fullName, username } = updateData;

    // Check if username is already taken (if changed)
    if (username && username.toLowerCase() !== user.username) {
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (existingUser) {
        throw new Error('USERNAME_EXISTS');
      }

      user.username = username.toLowerCase();
    }

    if (fullName) {
      user.fullName = fullName;
    }

    await user.save();
    return user;
  }

  // Change password
  async changePassword(user, currentPassword, newPassword) {
    // Validate current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      throw new Error('INVALID_CURRENT_PASSWORD');
    }

    // Update new password
    user.password = newPassword;
    await user.save();

    // Remove all refresh tokens to force re-login
    await user.removeAllRefreshTokens();

    return true;
  }

  // Handle error messages
  getErrorMessage(error) {
    const errorMessages = require('../validation/auth/errorMessages');
    return errorMessages[error.message] || 'An unexpected error occurred';
  }
}

module.exports = new AuthService();