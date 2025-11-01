# 📋 Hướng dẫn Phân quyền & Tạo tài khoản

## 🎯 Tổng quan hệ thống phân quyền

Hệ thống có **2 loại tài khoản** riêng biệt:

### 👨‍💼 **Admin (Quản trị viên)**
- **Mục đích**: Quản lý hệ thống, phân quyền, quản lý khách hàng
- **Thông tin**: username, email, password, fullName, role, department, permissions
- **API**: `/api/admin/*`
- **3 cấp độ**: super_admin, vip_admin, admin

### 👥 **User (Khách hàng)**
- **Mục đích**: Đăng ký mua hàng, xem thông tin cá nhân
- **Thông tin**: name, email, phone (đơn giản)
- **API**: `/api/auth/*` và `/api/users/*` (admin quản lý)
- **Không có quyền/phân quyền**

---

## 🚀 Các bước tạo tài khoản

### Bước 1: Chuẩn bị môi trường

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi động MongoDB (terminal riêng)
mongod

# 3. Tạo dữ liệu mẫu (roles, permissions, departments, admin)
npm run seed

# 4. Khởi động server
npm run dev
```

### Bước 2: Đăng nhập Admin (để quản lý)

#### Đăng nhập Superadmin (có sẵn từ seed)
```bash
POST /api/admin/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "super123"
}
```
**Response**: Lấy `accessToken` để sử dụng cho các API admin

#### Đăng nhập Vipadmin
```bash
POST /api/admin/login
Content-Type: application/json

{
  "email": "vipadmin@example.com",
  "password": "vip123"
}
```

#### Đăng nhập Admin thường
```bash
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Bước 3: Tạo Admin mới

#### Tạo Admin thường (chỉ Superadmin được tạo)
```bash
POST /api/admin/register
Authorization: Bearer <superadminAccessToken>
Content-Type: application/json

{
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "admin123",
  "fullName": "New Admin",
  "department": "<departmentId>",
  "permissions": ["<viewPermissionId>", "<editPermissionId>"]
}
```

#### Tạo Admin VIP (username đặc biệt)
```bash
POST /api/admin/register
Authorization: Bearer <superadminAccessToken>
Content-Type: application/json

{
  "username": "check_vip_admin:khuongcute",
  "email": "vip@example.com",
  "password": "vip123",
  "fullName": "VIP Admin",
  "department": "<departmentId>",
  "permissions": ["<viewPermissionId>", "<editPermissionId>", "<deletePermissionId>"]
}
```
**Lưu ý**: Username `check_vip_admin:khuongcute` sẽ tự động gán role `vip_admin`

### Bước 4: Tạo User (Khách hàng)

#### Đăng ký User mới
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "customer@example.com",
  "phone": "0123456789"
}
```

#### Đăng nhập User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

### Bước 5: Quản lý User (Admin only)

#### Xem danh sách User
```bash
GET /api/users?page=1&limit=10
Authorization: Bearer <adminAccessToken>
```

#### Gán quyền cho User
```bash
POST /api/admin/users/<userId>/permissions
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "permissions": ["<viewPermissionId>", "<editPermissionId>"]
}
```

#### Cập nhật thông tin User
```bash
PUT /api/users/<userId>
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "name": "Tên đã cập nhật",
  "phone": "0987654321"
}
```

---

## 🔑 Quy tắc phân quyền

### Admin Roles:
- **super_admin**: Toàn quyền, tạo admin khác
- **vip_admin**: Quyền cao, quản lý user
- **admin**: Quyền cơ bản, xem/sửa user

### Permissions:
- **View**: Xem dữ liệu
- **Edit**: Chỉnh sửa dữ liệu
- **Delete**: Xóa dữ liệu
- **Update**: Cập nhật dữ liệu
- **Show**: Hiển thị dữ liệu
- **Create**: Tạo dữ liệu mới

### Departments:
- **IT Department**: Phòng IT
- **HR Department**: Phòng Nhân sự
- **Finance Department**: Phòng Tài chính

---

## 🧪 Test với Postman

1. **Import collection**: `postman-testing/postman_collection.json`
2. **Đăng nhập admin** để lấy token
3. **Set variables** từ response
4. **Test các API** theo thứ tự

---

## ⚠️ Lưu ý quan trọng

1. **User (khách hàng)** chỉ lưu thông tin cơ bản, không có role/quyền
2. **Admin** có đầy đủ role, department, permissions
3. **Chỉ Superadmin** mới tạo được admin khác
4. **Username đặc biệt** `check_vip_admin:khuongcute` → role `vip_admin`
5. **Token admin** khác với token user
6. **API admin** (`/api/admin/*`) khác với API user (`/api/auth/*`)

---

## 📞 Hỗ trợ

Nếu gặp lỗi, kiểm tra:
- MongoDB đã chạy chưa
- Token có hợp lệ không
- Role/Department/Permission ID có đúng không
- Server có chạy trên port 3000 không