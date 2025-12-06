const Admin = require('../models/Admin');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const jwt = require('jsonwebtoken');
const { Kafka } = require('kafkajs');
const errorMessages = require('../validation/auth/errorMessages');

class AdminService {

  constructor() {
    this.kafka = new Kafka({
      clientId: 'admin-service',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
    });
    this.producer = this.kafka.producer();
  }

  // Send notification via Kafka
  async sendAdminNotification(adminData) {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: 'admin-notifications',
        messages: [
          {
            key: 'admin-created',
            value: JSON.stringify({
              type: 'admin_created',
              email: adminData.email,
              fullName: adminData.fullName,
              role: adminData.role,
              timestamp: new Date().toISOString()
            })
          }
        ]
      });
      console.log('✅ Kafka message sent for admin creation:', adminData.email);
    } catch (error) {
      console.error('❌ Failed to send Kafka message:', error);
    } finally {
      await this.producer.disconnect();
    }
  }
  generateTokens(admin) {
    const accessToken = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role?.name || admin.role
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      {
        id: admin._id,
        token: jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET)
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

    // Register admin
  async register(adminData) {
    try {
      const { username, email, password, fullName, department, role, permissions, creatorRole } = adminData;

      // Convert role name to ObjectId if needed
      let roleId = role;
      if (typeof role === 'string' && !role.match(/^[0-9a-fA-F]{24}$/)) {
        const roleDoc = await Role.findOne({ name: role });
        if (!roleDoc) {
          throw new Error('INVALID_ROLE');
        }
        roleId = roleDoc._id;
      }

      // Check permission to create admin based on creator's role hierarchy
      if (creatorRole) {
        const creatorRoleDoc = await Role.findOne({ name: creatorRole });
        const targetRoleDoc = await Role.findById(roleId);

        if (!creatorRoleDoc || !targetRoleDoc) {
          throw new Error('INVALID_ROLE');
        }

        // Superadmin can create all roles, vipadmin can only create admin
        if (creatorRoleDoc.hierarchy === 2 && targetRoleDoc.hierarchy >= 2) {
          throw new Error('CANNOT_CREATE_HIGHER_ROLE');
        }
      }

      // Check if email already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        throw new Error('EMAIL_EXISTS');
      }

      // Check if username already exists
      const existingUsername = await Admin.findOne({ username });
      if (existingUsername) {
        throw new Error('USERNAME_EXISTS');
      }

      // Create new admin
      const admin = new Admin({
        username,
        email,
        password,
        fullName,
        department,
        role: roleId,
        permissions
      });

      await admin.save();

      // Send notification via Kafka
      await this.sendAdminNotification({
        email: admin.email,
        fullName: admin.fullName,
        role: roleId
      });

      // Return admin (without password)
      const adminResponse = admin.toObject();
      delete adminResponse.password;
      delete adminResponse.refreshTokens;

      return {
        success: true,
        message: 'Admin registered successfully',
        admin: adminResponse
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }

    // Admin login
  async login(email, password) {
    try {
      console.log('AdminService.login called with:', email);
      // Find admin by email and populate role and department
      const admin = await Admin.findOne({ email: email.toLowerCase() }).populate('department role permissions');
      console.log('Admin found:', !!admin);
      if (!admin) {
        throw new Error('ADMIN_NOT_FOUND');
      }

      // Check if account is active
      if (!admin.isActive) {
        throw new Error('ACCOUNT_DISABLED');
      }

      // Compare password
      const isMatch = await admin.comparePassword(password);
      console.log('Password match:', isMatch);

      if (!isMatch) {
        throw new Error('INVALID_PASSWORD');
      }

      // Update last login time (if field exists)
      if (admin.lastLogin !== undefined) {
        admin.lastLogin = new Date();
        await admin.save();
      }

      // Generate tokens
      const tokens = this.generateTokens(admin);
      console.log('Tokens generated:', !!tokens.accessToken);
      // Save refresh token to database
      await admin.addRefreshToken(tokens.refreshToken);
      console.log('Refresh token saved to database');

      // Prepare admin info to return
      const adminInfo = {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        department: admin.department,
        permissions: admin.permissions
      };

      return {
        success: true,
        message: 'Admin login successful',
        admin: adminInfo,
        tokens
      };
    } catch (error) {
      console.error('AdminService.login error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }

  // Assign permissions to user (only admin can do this)
  async assignPermissionsToUser(adminId, userId, permissions) {
    try {
      const admin = await Admin.findById(adminId).populate('department role');
      if (!admin) {
        throw new Error('ADMIN_NOT_FOUND');
      }

      const user = await User.findById(userId).populate('department');
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Check if admin is in the same department as user
      if (admin.department._id.toString() !== user.department._id.toString()) {
        throw new Error('ADMIN_NOT_IN_SAME_DEPARTMENT');
      }

      // Validate permissions
      const validPermissions = await Permission.find({ _id: { $in: permissions } });
      if (validPermissions.length !== permissions.length) {
        throw new Error('INVALID_PERMISSIONS');
      }

      // Assign permissions to user
      user.permissions = permissions;
      await user.save();

      return {
        success: true,
        message: 'Permissions assigned to user successfully',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          permissions: user.permissions
        }
      };
    } catch (error) {
      return {
        success: false,
        message: errorMessages[error.message] || 'An unexpected error occurred'
      };
    }
  }

  // Get all admins for chat
  async getAllAdminsForChat() {
    try {
      const admins = await Admin.find({})
        .select('_id username email fullName avatar role')

      // Format response
      const formattedAdmins = admins.map(admin => ({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        avatar: admin.avatar,
        role: admin.role.name || admin.role,
      }));

      return formattedAdmins;
    } catch (error) {
      throw new Error('Failed to fetch admins for chat');
    }
  }
}

module.exports = new AdminService();