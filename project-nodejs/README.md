# Node.js Authentication API với Express.js và Passport.js

Hệ thống authentication đầy đủ với đăng ký, đăng nhập, logout, và refresh token sử dụng Passport.js và JWT.

## 🚀 Tính năng

- ✅ Đăng ký tài khoản
- ✅ Đăng nhập với email/password
- ✅ JWT Access Token và Refresh Token
- ✅ Đăng xuất (single device)
- ✅ Đăng xuất tất cả thiết bị
- ✅ Bảo vệ routes với middleware
- ✅ Cập nhật thông tin cá nhân
- ✅ Upload và cập nhật avatar
- ✅ Đổi mật khẩu
- ✅ Hash password với bcrypt
- ✅ Validation dữ liệu đầu vào
- ✅ File upload với multer

## 📋 Yêu cầu

- Node.js (v14+)
- MongoDB
- npm hoặc yarn

## ⚙️ Cài đặt

1. **Clone hoặc tạo dự án:**
```bash
cd project-nodejs
npm install
```

2. **Cài đặt MongoDB:**
   - Cài đặt MongoDB locally hoặc sử dụng MongoDB Atlas
   - Cập nhật `MONGODB_URI` trong file `.env`

3. **Cấu hình environment:**
   - Copy `.env.example` thành `.env`
   - Cập nhật các giá trị trong `.env`

4. **Chạy server:**
```bash
npm start
# hoặc cho development:
npm run dev
```

## 🔧 Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project-nodejs

# JWT Secrets - QUAN TRỌNG: Thay đổi trong production
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# JWT Expiration
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

## 📚 API Endpoints

### Authentication

#### 1. Đăng ký (không có avatar)
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

#### 1b. Đăng ký (có avatar)
```
POST /api/auth/register
Content-Type: multipart/form-data

FormData:
- username: johndoe
- email: john@example.com
- password: password123
- fullName: John Doe
- avatar: [file.jpg] (max 5MB, only images)
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "15m"
  }
}
```

#### 2. Đăng nhập
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Làm mới token
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 4. Đăng xuất
```
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 5. Đăng xuất tất cả thiết bị
```
POST /api/auth/logout-all
Authorization: Bearer <access_token>
```

### User Profile

#### 6. Lấy thông tin cá nhân
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### 7. Cập nhật thông tin
```
PUT /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Smith",
  "username": "johnsmith"
}
```

#### 8. Cập nhật avatar
```
PUT /api/auth/avatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

FormData:
- avatar: [new-avatar.jpg] (max 5MB, only images)
```

#### 9. Đổi mật khẩu
```
PUT /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### Protected Routes

#### 10. Route được bảo vệ
```
GET /api/hello
Authorization: Bearer <access_token>
```

#### 11. Health Check
```
GET /api/health
```

## 🔒 Bảo mật

### Middleware Available

- `authenticateToken`: Xác thực JWT access token
- `authenticateRefreshToken`: Xác thực refresh token
- `validateRegister`: Validate dữ liệu đăng ký
- `validateLogin`: Validate dữ liệu đăng nhập
- `optionalAuth`: Xác thực tùy chọn
- `requireAdmin`: Yêu cầu quyền admin (tùy chỉnh)

### Sử dụng Middleware

```javascript
const { authenticateToken } = require('./middleware/auth');

// Bảo vệ route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
```

## 📝 Cấu trúc dự án (MVC Pattern)

```
project-nodejs/
├── config/
│   └── passport.js         # Cấu hình Passport strategies
├── controllers/            # Controller layer - xử lý HTTP requests
│   ├── AuthController.js   # Authentication controller
│   └── UserController.js   # User management controller
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── upload.js          # File upload middleware
│   └── validation.js      # Input validation middleware
├── models/                # Model layer - database schemas
│   └── User.js            # User model với Mongoose
├── routes/                # Route layer - định nghĩa endpoints
│   ├── auth.js            # Authentication routes
│   └── users.js           # User management routes
├── services/              # Service layer - business logic
│   └── AuthService.js     # Authentication business logic
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── index.js              # Main server file
├── package.json          # Dependencies
└── README.md             # Documentation
```

### 🏗️ **Kiến trúc MVC:**

- **Models**: Định nghĩa cấu trúc dữ liệu và database schemas
- **Views**: API responses (JSON) - không có template engine
- **Controllers**: Xử lý HTTP requests, gọi services, trả về responses
- **Services**: Chứa business logic, xử lý dữ liệu phức tạp
- **Routes**: Định nghĩa endpoints và ánh xạ tới controllers
- **Middleware**: Tách riêng authentication, validation, file upload

## 🧪 Test với Postman/curl

### 1. Đăng ký:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 2. Đăng nhập:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Truy cập route được bảo vệ:
```bash
curl -X GET http://localhost:3000/api/hello \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚨 Lưu ý quan trọng

1. **Thay đổi JWT secrets** trong production
2. **Sử dụng HTTPS** trong production
3. **Cấu hình rate limiting** để chống brute force
4. **Backup database** thường xuyên
5. **Monitor logs** để phát hiện anomalies

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.