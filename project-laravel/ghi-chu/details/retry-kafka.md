Kafka Topic (product_events)
       ↓
  Laravel Consumer
       ↓
   ❌ Xử lý lỗi?
       ↓
ProductDlqProducer → gửi sang → product_events_dlq (DLQ topic)
       ↓
ProductDlqConsumer → đọc từ DLQ
       ↓
RetryDlqMessage Job → gửi lại Kafka (ProductEventProducer)


# Terminal 1: Start consumer cache
php artisan product:kafka-cache &

# Terminal 2: Start DLQ consumer  
php artisan product:kafka-dlq &

# Terminal 3: Start queue worker
php artisan queue:work &