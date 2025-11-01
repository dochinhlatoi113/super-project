// =========================================
// USER MANAGEMENT REQUEST EXAMPLES
// =========================================
// Base URL: http://localhost:3000/api/users
// All endpoints require admin role and valid access token

// =========================================
// 1. LẤY DANH SÁCH NGƯỜI DÙNG
// =========================================

const getAllUsersRequest = {
  method: 'GET',
  url: '/api/users',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Admin access token
  },
  queryParams: {
    page: 1,        // Optional: trang hiện tại (default: 1)
    limit: 10,      // Optional: số user mỗi trang (default: 10)
    search: 'john', // Optional: tìm kiếm theo username, email, fullName
    role: 'user',   // Optional: lọc theo role ('user', 'admin')
    status: 'active' // Optional: lọc theo trạng thái ('active', 'inactive')
  }
};

const getAllUsersSuccessResponse = {
  success: true,
  data: {
    users: [
      {
        _id: '507f1f77bcf86cd799439011',
        username: 'johndoe',
        email: 'john@example.com',
        fullName: 'John Doe',
        avatar: 'avatar_1698501234567-123456789.jpg',
        avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-123456789.jpg',
        role: 'user',
        isActive: true,
        lastLogin: '2025-10-28T13:34:07.135Z',
        createdAt: '2025-10-28T13:34:07.135Z',
        updatedAt: '2025-10-28T13:34:07.135Z'
      },
      {
        _id: '507f1f77bcf86cd799439012',
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Administrator',
        avatar: null,
        avatarUrl: null,
        role: 'admin',
        isActive: true,
        lastLogin: '2025-10-28T13:30:00.000Z',
        createdAt: '2025-10-28T13:00:00.000Z',
        updatedAt: '2025-10-28T13:30:00.000Z'
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 5,
      totalUsers: 47,
      hasNext: true,
      hasPrev: false
    }
  }
};

// =========================================
// 2. LẤY THỐNG KÊ NGƯỜI DÙNG
// =========================================

const getUserStatsRequest = {
  method: 'GET',
  url: '/api/users/stats',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Admin access token
  }
};

const getUserStatsSuccessResponse = {
  success: true,
  data: {
    totalUsers: 47,
    activeUsers: 42,
    inactiveUsers: 5,
    adminUsers: 2,
    regularUsers: 45,
    recentRegistrations: {
      today: 3,
      thisWeek: 12,
      thisMonth: 28
    },
    lastLoginStats: {
      last24Hours: 15,
      last7Days: 35,
      last30Days: 42
    }
  }
};

// =========================================
// 3. LẤY CHI TIẾT NGƯỜI DÙNG THEO ID
// =========================================

const getUserByIdRequest = {
  method: 'GET',
  url: '/api/users/507f1f77bcf86cd799439011',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Admin access token
  }
};

const getUserByIdSuccessResponse = {
  success: true,
  data: {
    user: {
      _id: '507f1f77bcf86cd799439011',
      username: 'johndoe',
      email: 'john@example.com',
      fullName: 'John Doe',
      avatar: 'avatar_1698501234567-123456789.jpg',
      avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-123456789.jpg',
      role: 'user',
      isActive: true,
      lastLogin: '2025-10-28T13:34:07.135Z',
      createdAt: '2025-10-28T13:34:07.135Z',
      updatedAt: '2025-10-28T13:34:07.135Z',
      refreshTokens: ['token1', 'token2'], // Số lượng refresh tokens
      loginHistory: [
        {
          timestamp: '2025-10-28T13:34:07.135Z',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        }
      ]
    }
  }
};

const getUserByIdNotFoundResponse = {
  success: false,
  message: 'Không tìm thấy người dùng'
};

// =========================================
// 4. CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
// =========================================

const updateUserRequest = {
  method: 'PUT',
  url: '/api/users/507f1f77bcf86cd799439011',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Admin access token
    'Content-Type': 'application/json'
  },
  body: {
    fullName: 'John Smith', // Optional
    username: 'johnsmith',  // Optional
    role: 'admin',          // Optional: 'user' hoặc 'admin'
    isActive: true          // Optional: true/false
  }
};

const updateUserSuccessResponse = {
  success: true,
  message: 'Cập nhật người dùng thành công',
  data: {
    user: {
      _id: '507f1f77bcf86cd799439011',
      username: 'johnsmith',
      email: 'john@example.com',
      fullName: 'John Smith',
      avatar: 'avatar_1698501234567-123456789.jpg',
      avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-123456789.jpg',
      role: 'admin',
      isActive: true,
      lastLogin: '2025-10-28T13:34:07.135Z',
      createdAt: '2025-10-28T13:34:07.135Z',
      updatedAt: '2025-10-28T14:00:00.000Z'
    }
  }
};

const updateUserValidationErrorResponse = {
  success: false,
  message: 'Dữ liệu không hợp lệ',
  errors: [
    'Username đã được sử dụng',
    'Role phải là "user" hoặc "admin"'
  ]
};

// =========================================
// 5. XÓA NGƯỜI DÙNG
// =========================================

const deleteUserRequest = {
  method: 'DELETE',
  url: '/api/users/507f1f77bcf86cd799439011',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Admin access token
  }
};

const deleteUserSuccessResponse = {
  success: true,
  message: 'Xóa người dùng thành công'
};

const deleteUserCannotDeleteSelfResponse = {
  success: false,
  message: 'Không thể xóa tài khoản của chính mình'
};

// =========================================
// 6. CHUYỂN ĐỔI TRẠNG THÁI NGƯỜI DÙNG
// =========================================

const toggleUserStatusRequest = {
  method: 'POST',
  url: '/api/users/507f1f77bcf86cd799439011/toggle-status',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Admin access token
  }
};

const toggleUserStatusSuccessResponse = {
  success: true,
  message: 'Cập nhật trạng thái người dùng thành công',
  data: {
    user: {
      _id: '507f1f77bcf86cd799439011',
      username: 'johndoe',
      email: 'john@example.com',
      fullName: 'John Doe',
      avatar: 'avatar_1698501234567-123456789.jpg',
      avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-123456789.jpg',
      role: 'user',
      isActive: false, // Đã bị vô hiệu hóa
      lastLogin: '2025-10-28T13:34:07.135Z',
      createdAt: '2025-10-28T13:34:07.135Z',
      updatedAt: '2025-10-28T14:00:00.000Z'
    }
  }
};

const toggleUserStatusCannotDisableSelfResponse = {
  success: false,
  message: 'Không thể vô hiệu hóa tài khoản của chính mình'
};

// =========================================
// ERROR RESPONSES
// =========================================

const unauthorizedResponse = {
  success: false,
  message: 'Không có quyền truy cập. Yêu cầu quyền admin.'
};

const forbiddenResponse = {
  success: false,
  message: 'Truy cập bị từ chối'
};

const notFoundResponse = {
  success: false,
  message: 'Không tìm thấy người dùng'
};

const validationErrorResponse = {
  success: false,
  message: 'Dữ liệu không hợp lệ',
  errors: [
    'ID người dùng không hợp lệ',
    'Username đã tồn tại',
    'Email không hợp lệ'
  ]
};

// =========================================
// CURL EXAMPLES
// =========================================

// Lấy danh sách user với curl:
const curlGetUsers = `
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&search=john" \\
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
`;

// Lấy thống kê user với curl:
const curlGetUserStats = `
curl -X GET http://localhost:3000/api/users/stats \\
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
`;

// Lấy chi tiết user với curl:
const curlGetUserById = `
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \\
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
`;

// Cập nhật user với curl:
const curlUpdateUser = `
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \\
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "Updated Name",
    "role": "admin",
    "isActive": true
  }'
`;

// Xóa user với curl:
const curlDeleteUser = `
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011 \\
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
`;

// Toggle status user với curl:
const curlToggleUserStatus = `
curl -X POST http://localhost:3000/api/users/507f1f77bcf86cd799439011/toggle-status \\
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
`;

module.exports = {
  getAllUsersRequest,
  getAllUsersSuccessResponse,
  getUserStatsRequest,
  getUserStatsSuccessResponse,
  getUserByIdRequest,
  getUserByIdSuccessResponse,
  getUserByIdNotFoundResponse,
  updateUserRequest,
  updateUserSuccessResponse,
  updateUserValidationErrorResponse,
  deleteUserRequest,
  deleteUserSuccessResponse,
  deleteUserCannotDeleteSelfResponse,
  toggleUserStatusRequest,
  toggleUserStatusSuccessResponse,
  toggleUserStatusCannotDisableSelfResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  validationErrorResponse,
  curlGetUsers,
  curlGetUserStats,
  curlGetUserById,
  curlUpdateUser,
  curlDeleteUser,
  curlToggleUserStatus
};