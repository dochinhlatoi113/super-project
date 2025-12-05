# Kafka Notification Service

Service độc lập để consume Kafka messages và gửi notifications tới Socket.IO server.

## 📋 Features

- ✅ Consume Kafka topic: `admin-notifications`
- ✅ Gửi HTTP request tới Socket.IO server
- ✅ Broadcast notifications tới tất cả clients
- ✅ Graceful shutdown

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

File `.env`:
```env
KAFKA_BROKERS=localhost:9092
SOCKETIO_SERVER_URL=http://localhost:3001
PORT=3002
```

## 🏃 Run

```bash
# Development
npm run dev

# Production
npm start
```

## 📊 Flow

```
Kafka Producer (project-nodejs)
    ↓ Publish message to 'admin-notifications'
    ↓
Kafka Consumer (project-kafka) ← ĐÂY
    ↓ HTTP POST request
    ↓
Socket.IO Server (project-socketio)
    ↓ io.emit('admin-notification', data)
    ↓
Next.js Clients (project-nextjs)
```

## 🔧 Dependencies

- `kafkajs` - Kafka client
- `axios` - HTTP client
- `dotenv` - Environment variables

## 📝 Message Format

Kafka message:
```json
{
  "type": "admin_created",
  "email": "admin@example.com",
  "fullName": "Admin Name",
  "role": "admin",
  "timestamp": "2025-12-05T00:00:00.000Z"
}
```

HTTP request to Socket.IO:
```json
{
  "event": "admin-notification",
  "data": {
    "message": "Đã tạo thành công admin có email là: admin@example.com",
    "admin": {
      "email": "admin@example.com",
      "fullName": "Admin Name",
      "role": "admin"
    },
    "timestamp": "2025-12-05T00:00:00.000Z"
  }
}
```
