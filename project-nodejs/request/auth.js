// =========================================
// AUTHENTICATION REQUEST EXAMPLES
// =========================================
// Base URL: http://localhost:3000/api/auth

// =========================================
// 1. ĐĂNG KÝ TÀI KHOẢN
// =========================================

// 1a. Đăng ký không có avatar (JSON)
const registerWithoutAvatar = {
  method: 'POST',
  url: '/api/auth/register',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe'
  }
};

// 1b. Đăng ký có avatar (Form Data)
const registerWithAvatar = {
  method: 'POST',
  url: '/api/auth/register',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  formData: {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    avatar: '[FILE: avatar.jpg]' // File ảnh (max 5MB)
  }
};

// Response thành công:
const registerSuccessResponse = {
  success: true,
  message: 'Đăng ký thành công',
  user: {
    _id: '507f1f77bcf86cd799439011',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: 'avatar_1698501234567-123456789.jpg',
    avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-123456789.jpg',
    role: 'user',
    isActive: true,
    createdAt: '2025-10-28T13:34:07.135Z',
    updatedAt: '2025-10-28T13:34:07.135Z'
  },
  tokens: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expiresIn: '15m'
  }
};

// Response lỗi - Email đã tồn tại:
const registerEmailExistsResponse = {
  success: false,
  message: 'Email đã được sử dụng'
};

// Response lỗi - Validation:
const registerValidationErrorResponse = {
  success: false,
  message: 'Dữ liệu không hợp lệ',
  errors: [
    'Username phải có ít nhất 3 ký tự',
    'Email không hợp lệ'
  ]
};

// =========================================
// 2. ĐĂNG NHẬP
// =========================================

const loginRequest = {
  method: 'POST',
  url: '/api/auth/login',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    email: 'john@example.com',
    password: 'password123'
  }
};

const loginSuccessResponse = {
  success: true,
  message: 'Đăng nhập thành công',
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
    updatedAt: '2025-10-28T13:34:07.135Z'
  },
  tokens: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expiresIn: '15m'
  }
};

const loginInvalidCredentialsResponse = {
  success: false,
  message: 'Thông tin đăng nhập không đúng'
};

// =========================================
// 3. LÀM MỚI TOKEN
// =========================================

const refreshTokenRequest = {
  method: 'POST',
  url: '/api/auth/refresh',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Refresh token từ login
  }
};

const refreshTokenSuccessResponse = {
  success: true,
  message: 'Token đã được làm mới',
  tokens: {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    expiresIn: '15m'
  }
};

// =========================================
// 4. ĐĂNG XUẤT
// =========================================

const logoutRequest = {
  method: 'POST',
  url: '/api/auth/logout',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Access token
    'Content-Type': 'application/json'
  },
  body: {
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Optional: chỉ logout device này
  }
};

const logoutSuccessResponse = {
  success: true,
  message: 'Đăng xuất thành công'
};

// =========================================
// 5. ĐĂNG XUẤT TẤT CẢ THIẾT BỊ
// =========================================

const logoutAllRequest = {
  method: 'POST',
  url: '/api/auth/logout-all',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Access token
  }
};

const logoutAllSuccessResponse = {
  success: true,
  message: 'Đã đăng xuất khỏi tất cả thiết bị'
};

// =========================================
// 6. LẤY THÔNG TIN CÁ NHÂN
// =========================================

const getProfileRequest = {
  method: 'GET',
  url: '/api/auth/me',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Access token
  }
};

const getProfileSuccessResponse = {
  success: true,
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
    updatedAt: '2025-10-28T13:34:07.135Z'
  }
};

// =========================================
// 7. CẬP NHẬT THÔNG TIN CÁ NHÂN
// =========================================

const updateProfileRequest = {
  method: 'PUT',
  url: '/api/auth/profile',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Access token
    'Content-Type': 'application/json'
  },
  body: {
    fullName: 'John Smith', // Optional
    username: 'johnsmith'   // Optional
  }
};

const updateProfileSuccessResponse = {
  success: true,
  message: 'Cập nhật thông tin thành công',
  user: {
    _id: '507f1f77bcf86cd799439011',
    username: 'johnsmith',
    email: 'john@example.com',
    fullName: 'John Smith',
    avatar: 'avatar_1698501234567-123456789.jpg',
    avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-123456789.jpg',
    role: 'user',
    isActive: true,
    lastLogin: '2025-10-28T13:34:07.135Z',
    createdAt: '2025-10-28T13:34:07.135Z',
    updatedAt: '2025-10-28T13:34:07.135Z'
  }
};

// =========================================
// 8. CẬP NHẬT AVATAR
// =========================================

const updateAvatarRequest = {
  method: 'PUT',
  url: '/api/auth/avatar',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Access token
    'Content-Type': 'multipart/form-data'
  },
  formData: {
    avatar: '[FILE: new-avatar.jpg]' // File ảnh mới (max 5MB)
  }
};

const updateAvatarSuccessResponse = {
  success: true,
  message: 'Cập nhật avatar thành công',
  user: {
    _id: '507f1f77bcf86cd799439011',
    username: 'johnsmith',
    email: 'john@example.com',
    fullName: 'John Smith',
    avatar: 'avatar_1698501234567-987654321.jpg', // Avatar mới
    avatarUrl: 'http://localhost:3000/uploads/avatars/avatar_1698501234567-987654321.jpg',
    role: 'user',
    isActive: true,
    lastLogin: '2025-10-28T13:34:07.135Z',
    createdAt: '2025-10-28T13:34:07.135Z',
    updatedAt: '2025-10-28T13:34:07.135Z'
  }
};

// =========================================
// 9. ĐỔI MẬT KHẨU
// =========================================

const changePasswordRequest = {
  method: 'PUT',
  url: '/api/auth/change-password',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Access token
    'Content-Type': 'application/json'
  },
  body: {
    currentPassword: 'password123',
    newPassword: 'newpassword456'
  }
};

const changePasswordSuccessResponse = {
  success: true,
  message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.'
};

// =========================================
// CURL EXAMPLES
// =========================================

// Đăng ký với curl:
const curlRegister = `
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
`;

// Đăng nhập với curl:
const curlLogin = `
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
`;

// Lấy profile với curl:
const curlGetProfile = `
curl -X GET http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
`;

// Cập nhật profile với curl:
const curlUpdateProfile = `
curl -X PUT http://localhost:3000/api/auth/profile \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "New Name",
    "username": "newusername"
  }'
`;

// Upload avatar với curl:
const curlUploadAvatar = `
curl -X PUT http://localhost:3000/api/auth/avatar \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -F "avatar=@/path/to/your/avatar.jpg"
`;

module.exports = {
  registerWithoutAvatar,
  registerWithAvatar,
  registerSuccessResponse,
  registerEmailExistsResponse,
  registerValidationErrorResponse,
  loginRequest,
  loginSuccessResponse,
  loginInvalidCredentialsResponse,
  refreshTokenRequest,
  refreshTokenSuccessResponse,
  logoutRequest,
  logoutSuccessResponse,
  logoutAllRequest,
  logoutAllSuccessResponse,
  getProfileRequest,
  getProfileSuccessResponse,
  updateProfileRequest,
  updateProfileSuccessResponse,
  updateAvatarRequest,
  updateAvatarSuccessResponse,
  changePasswordRequest,
  changePasswordSuccessResponse,
  curlRegister,
  curlLogin,
  curlGetProfile,
  curlUpdateProfile,
  curlUploadAvatar
};