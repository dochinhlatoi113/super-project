# 📘 DOCKER - HƯỚNG DẪN ĐẦY ĐỦ

## 📋 MỤC LỤC

1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)
2. [Quick Start](#quick-start)
3. [Container Management](#container-management)
4. [Logs & Monitoring](#logs--monitoring)
5. [Database Operations](#database-operations)
6. [Laravel Commands](#laravel-commands)
7. [Kafka Management](#kafka-management)
8. [Elasticsearch Operations](#elasticsearch-operations)
9. [Redis Operations](#redis-operations)
10. [Network & Debug](#network--debug)
11. [Troubleshooting](#troubleshooting)

---

## 📌 THÔNG TIN CƠ BẢN

### Containers trong Project

| Container               | Service             | Port | Purpose             |
| ----------------------- | ------------------- | ---- | ------------------- |
| `laravel_php`           | PHP 8.2-FPM         | -    | Laravel application |
| `laravel_nginx`         | Nginx               | 80   | Web server          |
| `laravel_mysql`         | MySQL 8.0           | 3306 | Database            |
| `laravel_redis`         | Redis 7             | 6379 | Cache & Queue       |
| `laravel_elasticsearch` | Elasticsearch 8.8.2 | 9200 | Search engine       |
| `laravel_kibana`        | Kibana 8.8.2        | 5601 | ES visualization    |
| `laravel_logstash`      | Logstash 8.8.2      | 5044 | Log processing      |
| `laravel_kafka`         | Kafka 3.x           | 9092 | Message broker      |
| `laravel_zookeeper`     | Zookeeper           | 2181 | Kafka coordination  |
| `laravel_queue`         | PHP Worker          | -    | Queue worker        |

### Biến môi trường quan trọng

```bash
# Elasticsearch
ELASTICSEARCH_HOST=http://laravel_elasticsearch:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=msWrVIxIVyrLgXPwfZj4

# MySQL
DB_HOST=laravel_mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=laravel

# Redis
REDIS_HOST=laravel_redis
REDIS_PORT=6379

# Kafka
KAFKA_BROKERS=laravel_kafka:9092
KAFKA_TOPIC_PRODUCT_EVENTS=product_events
```

### Docker Compose Files

```
docker-main/
├── docker-compose.yml      # Main compose file
├── php/
│   ├── Dockerfile
│   └── supervisord.conf    # Supervisor config for workers
├── nginx/
│   └── conf.d/
│       └── default.conf
├── mysql/
│   └── my.cnf
└── logstash/
    ├── config/
    └── pipeline/
        └── logstash.conf
```

---

## 🚀 QUICK START

### Start tất cả services

```bash
# 1. Start tất cả containers
cd docker-main && docker-compose up -d

# 2. Kiểm tra status
docker ps

# 3. Chạy migrations và seed
docker exec laravel_php php artisan migrate --seed

# 4. Khởi tạo Elasticsearch
docker exec laravel_php php artisan product:es-init

# 5. Reindex products
docker exec laravel_php php artisan product:es-reindex

# 6. Start Kafka consumers
cd /Users/buimanhkhuong/Desktop/project/src/scripts
./kafka-control.sh manual

# 7. Kiểm tra Kafka consumers
./kafka-control.sh status
```

### Stop tất cả services

```bash
cd docker-main && docker-compose down
```

### Rebuild services

```bash
# Rebuild và restart
cd docker-main && docker-compose up -d --build

# Rebuild specific service
cd docker-main && docker-compose up -d --build php
```

---

## 🐳 CONTAINER MANAGEMENT

### Kiểm tra trạng thái

```bash
# Xem tất cả containers đang chạy
docker ps

# Xem tất cả containers (kể cả stopped)
docker ps -a

# Xem thông tin chi tiết container
docker inspect laravel_php

# Kiểm tra resource usage (CPU, Memory, Network)
docker stats

# Kiểm tra resource của 1 container cụ thể
docker stats laravel_php

# Xem logs container
docker logs laravel_php --tail 100

# Follow logs real-time
docker logs laravel_php -f
```

### Restart containers

```bash
# Restart 1 container
docker restart laravel_php

# Restart tất cả containers
cd docker-main && docker-compose restart

# Restart specific service
cd docker-main && docker-compose restart php nginx mysql
```

### Stop/Start containers

```bash
# Stop container
docker stop laravel_php

# Start container
docker start laravel_php

# Stop tất cả containers
cd docker-main && docker-compose down

# Stop và xóa volumes
cd docker-main && docker-compose down -v

# Start tất cả containers
cd docker-main && docker-compose up -d
```

### Vào bên trong container (Interactive Shell)

```bash
# Vào bash của PHP container
docker exec -it laravel_php bash

# Vào bash của MySQL container
docker exec -it laravel_mysql bash

# Vào sh của Elasticsearch (Alpine Linux)
docker exec -it laravel_elasticsearch sh

# Vào bash của Kafka container
docker exec -it laravel_kafka bash

# Vào Redis CLI
docker exec -it laravel_redis redis-cli

# Vào MySQL CLI
docker exec -it laravel_mysql mysql -ularavel -plaravel laravel
```

### Container Health Check

```bash
# Xem health status
docker inspect --format='{{.State.Health.Status}}' laravel_php

# Xem full health logs
docker inspect laravel_php | jq '.[0].State.Health'

# Check container process
docker top laravel_php
```

---

## 🔍 LOGS & MONITORING

### Xem logs container

```bash
# PHP container
docker logs laravel_php --tail 100
docker logs laravel_php -f

# Nginx
docker logs laravel_nginx --tail 100

# MySQL
docker logs laravel_mysql --tail 100

# Elasticsearch
docker logs laravel_elasticsearch --tail 100

# Kibana
docker logs laravel_kibana --tail 100

# Kafka
docker logs laravel_kafka --tail 100

# Redis
docker logs laravel_redis --tail 100

# Queue worker
docker logs laravel_queue --tail 100
```

### Logs với timestamp

```bash
docker logs laravel_php --tail 100 --timestamps
```

### Logs từ thời điểm cụ thể

```bash
# Xem logs từ 30 phút trước
docker logs laravel_php --since 30m

# Xem logs từ 1 giờ trước
docker logs laravel_php --since 1h

# Xem logs từ ngày cụ thể
docker logs laravel_php --since 2025-10-18T10:00:00
```

### Logs Laravel trong container

```bash
# Product logs
docker exec laravel_php tail -f /var/www/html/app/Domain/Product/storage/logs/product.log

# Kafka logs
docker exec laravel_php tail -f /var/www/html/storage/logs/kafka-audit.log
docker exec laravel_php tail -f /var/www/html/storage/logs/kafka-cache.log
docker exec laravel_php tail -f /var/www/html/storage/logs/elasticsearch.log

# Laravel logs
docker exec laravel_php tail -f /var/www/html/storage/logs/laravel.log

# Supervisor logs (queue worker)
docker exec laravel_queue tail -f /var/www/html/storage/logs/supervisor.log
```

---

## 🗄️ DATABASE OPERATIONS

### MySQL Commands

```bash
# Kết nối MySQL CLI
docker exec -it laravel_mysql mysql -ularavel -plaravel laravel

# Chạy SQL query trực tiếp
docker exec laravel_mysql mysql -ularavel -plaravel laravel -e "SELECT COUNT(*) FROM products"

# Xem danh sách databases
docker exec laravel_mysql mysql -ularavel -plaravel -e "SHOW DATABASES"

# Xem danh sách tables
docker exec laravel_mysql mysql -ularavel -plaravel laravel -e "SHOW TABLES"

# Kiểm tra table structure
docker exec laravel_mysql mysql -ularavel -plaravel laravel -e "DESCRIBE products"

# Xem 10 records đầu tiên
docker exec laravel_mysql mysql -ularavel -plaravel laravel -e "SELECT * FROM products LIMIT 10"
```

### Database Backup & Restore

```bash
# Export database
docker exec laravel_mysql mysqldump -ularavel -plaravel laravel > backup.sql

# Export với gzip
docker exec laravel_mysql mysqldump -ularavel -plaravel laravel | gzip > backup.sql.gz

# Import database
cat backup.sql | docker exec -i laravel_mysql mysql -ularavel -plaravel laravel

# Import từ gzip
gunzip < backup.sql.gz | docker exec -i laravel_mysql mysql -ularavel -plaravel laravel
```

### Database Size & Stats

```bash
# Xem size của database
docker exec laravel_mysql mysql -ularavel -plaravel -e "
SELECT
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'laravel'
GROUP BY table_schema
"

# Xem size của từng table
docker exec laravel_mysql mysql -ularavel -plaravel -e "
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'laravel'
ORDER BY (data_length + index_length) DESC
"

# Count records trong từng table
docker exec laravel_mysql mysql -ularavel -plaravel laravel -e "
SELECT 'products' AS table_name, COUNT(*) AS count FROM products
UNION ALL
SELECT 'brands', COUNT(*) FROM brands
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'product_variants', COUNT(*) FROM product_variants
"
```

---

## 🚀 LARAVEL COMMANDS

### Artisan Commands

```bash
# Migrations
docker exec laravel_php php artisan migrate
docker exec laravel_php php artisan migrate:rollback
docker exec laravel_php php artisan migrate:fresh --seed

# Seeders
docker exec laravel_php php artisan db:seed
docker exec laravel_php php artisan db:seed --class=ProductSeeder
docker exec laravel_php php artisan db:seed --class=CategorySeeder

# Cache
docker exec laravel_php php artisan cache:clear
docker exec laravel_php php artisan config:clear
docker exec laravel_php php artisan route:clear
docker exec laravel_php php artisan view:clear

# Clear all caches
docker exec laravel_php php artisan optimize:clear

# Optimize
docker exec laravel_php php artisan optimize
docker exec laravel_php php artisan config:cache
docker exec laravel_php php artisan route:cache

# Queue workers
docker exec laravel_php php artisan queue:work
docker exec laravel_php php artisan queue:listen
docker exec laravel_php php artisan queue:restart

# Routes
docker exec laravel_php php artisan route:list
docker exec laravel_php php artisan route:list --path=api

# List commands
docker exec laravel_php php artisan list
```

### Product & Elasticsearch Commands

```bash
# Khởi tạo Elasticsearch index
docker exec laravel_php php artisan product:es-init

# Reindex tất cả products
docker exec laravel_php php artisan product:es-reindex

# Clear product cache
docker exec laravel_php php artisan product:clear-cache
```

### Custom Logging

**Config:** `config/logging.php`

```php
'product' => [
    'driver' => 'single',
    'path' => base_path('app/Domain/Product/storage/logs/product.log'),
    'level' => 'info',
],
```

**Usage:**

```php
Log::channel('product')->info('Kafka Product Action', [
    'action' => $payload['action'] ?? 'unknown',
    'data' => $payload['data'] ?? [],
]);
```

### Composer Commands

```bash
# Install dependencies
docker exec laravel_php composer install

# Update dependencies
docker exec laravel_php composer update

# Require package
docker exec laravel_php composer require mateusjunges/laravel-kafka

# Check package installed
docker exec laravel_php composer show mateusjunges/laravel-kafka

# Dump autoload
docker exec laravel_php composer dump-autoload
```

### Generate DDD Commands

```bash
# Tạo command init DDD
docker exec laravel_php php artisan make:command MakeDomainDDD

# Test tạo domain
docker exec laravel_php php artisan make:domain ProductVariant
```

---

## 📨 KAFKA MANAGEMENT

### Kafka Status & Control (Scripts)

```bash
# Kiểm tra status của Kafka consumers
cd /Users/buimanhkhuong/Desktop/project/src/scripts
./kafka-control.sh status

# Start Kafka consumers
./kafka-control.sh manual

# Stop Kafka consumers
./kafka-control.sh stop

# Restart Kafka consumers
./kafka-control.sh restart

# View logs
./kafka-control.sh logs
```

### Kafka Topics

```bash
# List tất cả topics
docker exec laravel_kafka kafka-topics --list --bootstrap-server localhost:9092

# Describe topic
docker exec laravel_kafka kafka-topics --describe --topic product_events --bootstrap-server localhost:9092

# Create topic manually
docker exec laravel_kafka kafka-topics --create --topic product_events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1

# Delete topic
docker exec laravel_kafka kafka-topics --delete --topic test-topic --bootstrap-server localhost:9092
```

### Kafka Consumer Groups

```bash
# List consumer groups
docker exec laravel_kafka kafka-consumer-groups --bootstrap-server localhost:9092 --list

# Check consumer group details (LAG, CONSUMER-ID)
docker exec laravel_kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group product-audit-group

docker exec laravel_kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group product-cache-group

docker exec laravel_kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group product-elasticsearch-group
```

### Kafka Consumer/Producer Testing

```bash
# Consume messages từ topic
docker exec -it laravel_kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic product_events --from-beginning

# Consume với max messages
docker exec laravel_kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic product_events --from-beginning --max-messages 10

# Produce message vào topic
docker exec -it laravel_kafka kafka-console-producer --bootstrap-server localhost:9092 --topic product_events
# Paste JSON và Enter, Ctrl+C để exit
```

### Supervisor Consumer Control

```bash
# Check status
docker exec laravel_queue supervisorctl status

# Start consumers
docker exec laravel_queue supervisorctl start kafka-product-audit kafka-product-cache kafka-product-elasticsearch

# Stop consumers (tắt Kafka logging & cache clearing)
docker exec laravel_queue supervisorctl stop kafka-product-audit kafka-product-cache kafka-product-elasticsearch

# Restart consumers
docker exec laravel_queue supervisorctl restart kafka-product-audit kafka-product-cache kafka-product-elasticsearch

# Restart all
docker exec laravel_queue supervisorctl restart all
```

### View Kafka Logs

```bash
# Product logs (includes Producer events)
docker exec laravel_queue tail -f /var/www/html/storage/logs/product.log

# Audit consumer logs
docker exec laravel_queue tail -f /var/www/html/storage/logs/kafka-audit.log

# Cache consumer logs
docker exec laravel_queue tail -f /var/www/html/storage/logs/kafka-cache.log

# Elasticsearch consumer logs
docker exec laravel_queue tail -f /var/www/html/storage/logs/elasticsearch.log
```

### Kafka Artisan Commands

```bash
# Start Kafka consumers manually
docker exec laravel_php php artisan product:kafka-audit
docker exec laravel_php php artisan product:kafka-cache
docker exec laravel_php php artisan product:kafka-elasticsearch

# Create Kafka topic
docker exec laravel_php php artisan product:kafka-create-topic
```

---

## 🔍 ELASTICSEARCH OPERATIONS

### Elasticsearch Health Check

```bash
# Kiểm tra health của cluster
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/_cluster/health?pretty"

# Xem danh sách indices
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/_cat/indices?v"

# Xem mapping của index
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_mapping?pretty"

# Xem settings của index
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_settings?pretty"
```

### Elasticsearch Data Operations

```bash
# Đếm số lượng documents
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_count?pretty"

# Get document theo ID
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_doc/12345?pretty"

# Search tất cả documents
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_search?pretty&size=5"

# Search với query
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_search?pretty" \
  -H 'Content-Type: application/json' -d '{
  "query": {
    "match": {
      "name": "laptop"
    }
  }
}'

# Delete index
curl -u elastic:msWrVIxIVyrLgXPwfZj4 -X DELETE "http://localhost:9200/products"

# Refresh index
curl -u elastic:msWrVIxIVyrLgXPwfZj4 -X POST "http://localhost:9200/products/_refresh"
```

### Elasticsearch Aggregations

```bash
# Tìm max price trong variants
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_search?pretty" \
  -H 'Content-Type: application/json' -d '{
  "size": 0,
  "aggs": {
    "max_price": {
      "nested": {
        "path": "variants"
      },
      "aggs": {
        "max": {
          "max": {
            "field": "variants.price"
          }
        }
      }
    }
  }
}'

# Top brands
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/products/_search?pretty" \
  -H 'Content-Type: application/json' -d '{
  "size": 0,
  "aggs": {
    "top_brands": {
      "terms": {
        "field": "brand_name.keyword",
        "size": 10
      }
    }
  }
}'
```

### Elasticsearch từ trong container

```bash
# Vào container
docker exec -it laravel_elasticsearch sh

# Curl từ trong container (không cần auth nếu internal)
curl http://localhost:9200/_cluster/health?pretty
curl http://localhost:9200/_cat/indices?v
```

---

## 🔴 REDIS OPERATIONS

### Redis CLI Commands

```bash
# Vào Redis CLI
docker exec -it laravel_redis redis-cli

# Ping Redis
docker exec laravel_redis redis-cli ping

# Xem tất cả keys
docker exec laravel_redis redis-cli KEYS '*'

# Xem keys có pattern
docker exec laravel_redis redis-cli KEYS 'products:*'

# Count keys
docker exec laravel_redis redis-cli DBSIZE

# Get giá trị của key
docker exec laravel_redis redis-cli GET "key_name"

# Set giá trị
docker exec laravel_redis redis-cli SET "test_key" "test_value"

# Delete key
docker exec laravel_redis redis-cli DEL "key_name"

# Delete keys theo pattern
docker exec laravel_redis redis-cli --scan --pattern "products:*" | xargs docker exec -i laravel_redis redis-cli DEL

# Flush database hiện tại
docker exec laravel_redis redis-cli FLUSHDB

# Flush tất cả databases
docker exec laravel_redis redis-cli FLUSHALL

# Xem thông tin Redis
docker exec laravel_redis redis-cli INFO

# Xem memory usage
docker exec laravel_redis redis-cli INFO memory

# Xem connected clients
docker exec laravel_redis redis-cli CLIENT LIST
```

### Redis Monitoring

```bash
# Monitor real-time commands
docker exec -it laravel_redis redis-cli MONITOR

# Slowlog
docker exec laravel_redis redis-cli SLOWLOG GET 10
```

---

## 🌐 NETWORK & DEBUG

### Network Inspection

```bash
# Xem danh sách networks
docker network ls

# Xem chi tiết network
docker network inspect docker-main_laravel

# Kiểm tra kết nối giữa containers
docker exec laravel_php ping laravel_mysql
docker exec laravel_php ping laravel_redis
docker exec laravel_php ping laravel_elasticsearch
docker exec laravel_php ping laravel_kafka

# Test DNS resolution
docker exec laravel_php nslookup laravel_mysql
```

### Port Mapping

```bash
# Xem ports đang được map
docker port laravel_nginx
docker port laravel_mysql
docker port laravel_elasticsearch
docker port laravel_kibana
docker port laravel_kafka

# Xem tất cả
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

### Copy files giữa host và container

```bash
# Copy từ host vào container
docker cp /path/on/host/file.txt laravel_php:/var/www/html/

# Copy folder
docker cp /path/on/host/folder laravel_php:/var/www/html/

# Copy từ container ra host
docker cp laravel_php:/var/www/html/file.txt /path/on/host/

# Copy logs
docker cp laravel_php:/var/www/html/storage/logs/laravel.log ./
```

### Disk Usage

```bash
# Xem disk usage tổng quan
docker system df

# Chi tiết
docker system df -v

# Xem size của từng container
docker ps --size
```

---

## 🛠️ TROUBLESHOOTING

### Xóa và rebuild containers

```bash
# Stop và xóa tất cả containers
cd docker-main && docker-compose down

# Xóa containers và volumes
cd docker-main && docker-compose down -v

# Rebuild và start lại
cd docker-main && docker-compose up -d --build

# Rebuild specific service
cd docker-main && docker-compose up -d --build php
```

### Xóa images và containers không dùng

```bash
# Xóa tất cả containers stopped
docker container prune

# Xóa tất cả images không được dùng
docker image prune -a

# Xóa tất cả volumes không được dùng
docker volume prune

# Xóa tất cả networks không được dùng
docker network prune

# Xóa tất cả (containers, images, volumes, networks)
docker system prune -a --volumes
```

### Container không start

```bash
# Check logs
docker logs laravel_php --tail 100

# Check port conflicts
lsof -i :80
lsof -i :3306
lsof -i :9200

# Force recreate
cd docker-main && docker-compose up -d --force-recreate php
```

### Permission issues

```bash
# Fix storage permissions
docker exec laravel_php chmod -R 777 storage bootstrap/cache

# Fix ownership
docker exec laravel_php chown -R www-data:www-data storage bootstrap/cache
```

### Database connection issues

```bash
# Check MySQL is running
docker ps | grep mysql

# Check MySQL logs
docker logs laravel_mysql --tail 50

# Test connection from PHP container
docker exec laravel_php php artisan tinker
# > DB::connection()->getPdo();

# Restart MySQL
docker-compose restart mysql
```

### Elasticsearch issues

```bash
# Check ES health
curl -u elastic:msWrVIxIVyrLgXPwfZj4 "http://localhost:9200/_cluster/health?pretty"

# Check ES logs
docker logs laravel_elasticsearch --tail 50

# Increase memory (if needed)
# Edit docker-compose.yml: ES_JAVA_OPTS=-Xms1g -Xmx1g

# Restart ES
docker-compose restart elasticsearch
```

### Kafka issues

```bash
# Check Kafka broker
docker exec laravel_kafka kafka-broker-api-versions --bootstrap-server localhost:9092

# Check Zookeeper
echo ruok | docker exec -i laravel_zookeeper nc localhost 2181

# Restart Kafka & Zookeeper
docker-compose restart zookeeper kafka
```

### Redis connection issues

```bash
# Test Redis
docker exec laravel_redis redis-cli ping

# Check Redis logs
docker logs laravel_redis --tail 50

# Restart Redis
docker-compose restart redis
```

---

## 📝 NOTES

### Kafka Consumer PIDs Location

```bash
/var/www/html/storage/logs/kafka/
├── audit.pid
├── cache.pid
└── elasticsearch.pid
```

### Supervisor Config Location

```bash
docker-main/php/supervisord.conf
```

### Important Files

```
docker-main/
├── docker-compose.yml           # Main compose
├── php/
│   ├── Dockerfile               # PHP image
│   └── supervisord.conf         # Workers config
├── nginx/
│   └── conf.d/
│       └── default.conf         # Nginx config
├── mysql/
│   └── my.cnf                   # MySQL config
└── logstash/
    └── pipeline/
        └── logstash.conf        # Logstash pipeline
```

### Environment Files

```
src/
├── .env                         # Current env
├── env-main/
│   ├── .env.local               # Local config
│   └── .env.prod                # Production config
```

---

## 🎯 CHECKLIST

-   [x] Tất cả containers đang chạy
-   [x] MySQL database đã migrate & seed
-   [x] Elasticsearch index đã khởi tạo
-   [x] Products đã được reindex vào Elasticsearch
-   [x] Kafka consumers đang chạy
-   [x] Redis đang hoạt động
-   [x] Nginx serving Laravel
-   [x] Kibana accessible tại http://localhost:5601
-   [x] Logstash đang consume Kafka messages
-   [x] Supervisor managing queue workers

---

## 🔗 LIÊN QUAN

-   **Elasticsearch:** Xem [ELASTICSEARCH_COMPLETE.md](./ELASTICSEARCH_COMPLETE.md)
-   **Kafka:** Xem [KAFKA_COMPLETE.md](./KAFKA_COMPLETE.md)
-   **Kibana:** Xem [KIBANA_COMPLETE.md](./KIBANA_COMPLETE.md)

---

**📅 Last Updated:** October 19, 2025  
**✅ Status:** Complete & Production Ready
