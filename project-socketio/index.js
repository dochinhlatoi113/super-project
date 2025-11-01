require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { Kafka } = require('kafkajs');

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// Kafka Consumer setup
const kafka = new Kafka({
  clientId: 'socket-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'admin-notification-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'admin-notifications', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const notification = JSON.parse(message.value.toString());
        
        if (notification.type === 'admin_created') {
          const logMessage = `Đã tạo thành công admin có email là: ${notification.email}`;
          console.log(logMessage);
          
          // Ghi log vào file (có thể thêm sau)
          // fs.appendFileSync('admin_notifications.log', `${new Date().toISOString()}: ${logMessage}\n`);
          
          // Emit to all connected admin clients
          io.emit('admin-notification', {
            message: logMessage,
            admin: {
              email: notification.email,
              fullName: notification.fullName,
              role: notification.role
            },
            timestamp: notification.timestamp
          });
        }
      },
    });
  } catch (error) {
    console.error('Kafka Consumer error:', error);
  }
};

runConsumer().catch(console.error);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log('listening on *:3001');
});