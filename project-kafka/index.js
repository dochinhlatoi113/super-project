require('dotenv').config();
const runKafkaConsumer = require('./config/kafka');

console.log('🚀 Kafka Notification Service');
console.log('📡 Kafka Brokers:', process.env.KAFKA_BROKERS || 'localhost:9092');
console.log('🔗 Socket.IO Server:', process.env.SOCKETIO_SERVER_URL || 'http://localhost:3001');

// Start Kafka consumer
runKafkaConsumer().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});
