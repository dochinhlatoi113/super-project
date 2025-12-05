const { Kafka } = require('kafkajs');
const axios = require('axios');

const kafka = new Kafka({
  clientId: 'kafka-notification-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'admin-notification-group' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✅ Kafka consumer connected');
    
    await consumer.subscribe({ topic: 'admin-notifications', fromBeginning: true });
    console.log('✅ Subscribed to topic: admin-notifications');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const notification = JSON.parse(message.value.toString());
          
          console.log('📨 Received notification:', notification);
          
          if (notification.type === 'admin_created') {
            const logMessage = `Đã tạo thành công admin có email là: ${notification.email}`;
            console.log('📢 Kafka notification:', logMessage);
            
            // Send HTTP request to Socket.IO server
            const socketioUrl = process.env.SOCKETIO_SERVER_URL || 'http://localhost:3001';
            
            try {
              const response = await axios.post(`${socketioUrl}/api/notifications/broadcast`, {
                event: 'admin-notification',
                data: {
                  message: logMessage,
                  admin: {
                    email: notification.email,
                    fullName: notification.fullName,
                    role: notification.role
                  },
                  timestamp: notification.timestamp
                }
              });
              
              console.log('✅ Notification sent to Socket.IO server:', response.status);
            } catch (httpError) {
              console.error('❌ Failed to send notification to Socket.IO:', httpError.message);
            }
          }
        } catch (parseError) {
          console.error('❌ Error parsing message:', parseError);
        }
      },
    });
    
    console.log('✅ Kafka consumer running');
  } catch (error) {
    console.error('❌ Kafka Consumer error:', error);
    process.exit(1);
  }
};

module.exports = runConsumer;
