# Super Project - Monorepo

Đây là một monorepo chứa các dự án microservices được tích hợp với nhau.

## Cấu trúc thư mục dự án

```
super-project/
├── project-kafka/          # Kafka setup với Docker
├── project-laravel/        # Laravel API (PHP)
├── project-nodejs/         # Node.js API với Kafka producer
├── project-socketio/       # Socket.IO server với Kafka consumer
└── README.md              # Tài liệu này
```

## Các dự án

### 1. project-nodejs
- **Công nghệ**: Node.js, Express, MongoDB, JWT, Passport.js
- **Chức năng**: API server cho authentication và quản lý admin/user
- **Kafka**: Producer gửi thông báo khi đăng ký admin
- **Port**: 3000

### 2. project-socketio
- **Công nghệ**: Node.js, Socket.IO
- **Chức năng**: Real-time server cho notifications
- **Kafka**: Consumer nhận thông báo từ nodejs và broadcast qua socket
- **Port**: 3001

### 3. project-laravel
- **Công nghệ**: Laravel (PHP), MySQL, Elasticsearch, Redis
- **Chức năng**: Product management API với full-text search
- **Kafka**: Tích hợp với các topic cho product events
- **Port**: 8000 (qua Docker)

### 4. project-kafka
- **Công nghệ**: Docker, Kafka, Zookeeper
- **Chức năng**: Message broker cho inter-service communication
- **Port**: 9092 (Kafka), 2181 (Zookeeper)

## Cách chạy

### 1. Clone repository
```bash
git clone https://github.com/dochinhlatoi113/super-project.git
cd super-project
```

### 2. Chạy Kafka (bắt buộc cho nodejs + socketio)
```bash
cd project-kafka
docker-compose up -d
```

### 3. Chạy Node.js API
```bash
cd project-nodejs
npm install
npm start
```

### 4. Chạy Socket.IO server
```bash
cd project-socketio
npm install
npm start
```

### 5. Chạy Laravel (tùy chọn)
```bash
cd project-laravel/docker-main
docker-compose up -d
```

## API Endpoints

### Node.js API (port 3000)
- `POST /api/auth/register-admin` - Đăng ký admin (gửi Kafka message)
- `POST /api/auth/login` - Đăng nhập
- Các endpoint khác cho user/admin management

### Laravel API (port 8000)
- Product management APIs
- Elasticsearch search
- Redis caching

## Kafka Topics
- `admin-registration` - Thông báo đăng ký admin từ nodejs → socketio

## Testing
1. Đăng ký admin qua Node.js API
2. Socket.IO server sẽ nhận message và broadcast notification
3. Kiểm tra logs của socketio server

## Environment Variables
Mỗi project có file `.env` riêng với cấu hình database, Kafka broker, etc.

## Development
- Sử dụng VS Code workspace cho development
- Mỗi project có cấu trúc riêng với dependencies và scripts
- Kafka broker: `localhost:29092` (Docker internal)