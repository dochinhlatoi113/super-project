# 📚 Project Documentation

> Tài liệu tổng hợp cho Laravel DDD Project với Elasticsearch, Kafka, Docker

---

## 📖 Mục lục

1. [🚀 Quick Start](#-quick-start)
2. [🔧 Environment Switcher](#-environment-switcher)
3. [📁 Cấu trúc DDD](#-cấu-trúc-ddd)
4. [🛣️ Routes Organization](#️-routes-organization)
5. [📝 Domain Logging](#-domain-logging)
6. [🔍 Elasticsearch](#-elasticsearch)
7. [📊 ELK Stack (Logstash + Kibana)](#-elk-stack)
8. [⚡ Kafka](#-kafka)
9. [🐳 Docker](#-docker)
10. [🔧 Scripts](#-scripts)

---

## 🚀 Quick Start

### Khởi động project

```bash
# Start Docker containers
cd /Users/buimanhkhuong/Desktop/project/docker-main
docker-compose up -d

# Check containers
docker ps

# Enter PHP container
docker exec -it laravel_php bash
```

### Môi trường (Environment)

```bash
# Switch to local environment
make env-local

# Switch to production environment
make env-prod

# Check current environment
make env-check
```

### Test API

```bash
# List products
curl http://localhost/api/v1/products

# Search products with Elasticsearch
curl http://localhost/api/v1/products/search?q=iphone

# Get product detail
curl http://localhost/api/v1/products/detail/iphone-15
```

---

## 🔧 Environment Switcher

### Sử dụng Makefile (Khuyên dùng)

```bash
make env-local    # Switch to local
make env-prod     # Switch to production
make env-check    # Check current environment
make env-list     # List available .env files
```

### Cấu trúc

```
project/
├── src/
│   └── env-main/
│       ├── .env.local          # Local config
│       ├── .env.prod           # Production config
│       └── .env.example        # Template
├── docker-switch-env.sh        # Switcher script
└── Makefile                    # Make commands
```

### Backup Files

Script tự động backup khi switch:

-   `.env.backup.local` - Backup khi switch từ local
-   `.env.backup.prod` - Backup khi switch từ production

**Chỉ có 2 backup files cố định** (không tạo nhiều files với timestamp)

### Environment Comparison

| Config               | Local                        | Production    |
| -------------------- | ---------------------------- | ------------- |
| `APP_ENV`            | `local`                      | `production`  |
| `APP_DEBUG`          | `true`                       | `false`       |
| `DB_HOST`            | `laravel_mysql`              | Production DB |
| `KAFKA_BROKERS`      | `laravel_kafka:9092`         | Cluster       |
| `ELASTICSEARCH_HOST` | `laravel_elasticsearch:9200` | Cluster       |

📖 **Chi tiết:** [ENVIRONMENT_SWITCHER.md](./details/ENVIRONMENT_SWITCHER.md)

---

## 📁 Cấu trúc DDD

### Domain Structure

```
app/Domain/
├── Product/
│   ├── Routes/                  # ← Routes của Product domain
│   │   ├── api.php             # CRUD routes
│   │   ├── search.php          # Elasticsearch routes
│   │   ├── variant.php         # Variant routes
│   │   └── variant_albums.php  # Albums routes
│   ├── Http/Controllers/
│   ├── Services/
│   ├── Repositories/
│   └── storage/logs/
│       └── product.log         # Domain logs
├── Category/
│   ├── Routes/
│   │   └── api.php
│   └── storage/logs/
│       └── category.log
└── Brand/
    ├── Routes/
    │   └── api.php
    └── storage/logs/
        └── brand.log
```

### Tại sao Product có nhiều route files?

Product domain phức tạp với **20 endpoints**:

-   **api.php** (6 endpoints) - Product CRUD
-   **search.php** (4 endpoints) - Elasticsearch search
-   **variant.php** (5 endpoints) - Product variants
-   **variant_albums.php** (5 endpoints) - Variant images

So sánh:

-   Category: 1 file (5 endpoints) - Simple CRUD
-   Brand: 1 file (5 endpoints) - Simple CRUD

📖 **Chi tiết:** [WHY_MULTIPLE_ROUTE_FILES.md](./details/WHY_MULTIPLE_ROUTE_FILES.md)

---

## 🛣️ Routes Organization

### Route Pattern

#### ❌ CŨ (conflict với /search):

```
GET /api/v1/products/{slug}
```

#### ✅ MỚI (sử dụng prefix /detail/):

```
GET /api/v1/products/detail/{slug}
```

### Product Routes

**CRUD:**

-   `GET /api/v1/products` - List products
-   `POST /api/v1/products` - Create product
-   `GET /api/v1/products/detail/{slug}` - Get product
-   `PUT /api/v1/products/detail/{slug}` - Update product
-   `DELETE /api/v1/products/detail/{slug}` - Delete product

**Search (Elasticsearch):**

-   `GET /api/v1/products/search?q=iphone` - Text search
-   `GET /api/v1/products/search/config?color=red` - Filter by config
-   `GET /api/v1/products/search/health` - ES health check

**Variants:**

-   `GET /api/v1/product_variants` - List variants
-   `POST /api/v1/product_variants` - Create variant
-   `GET /api/v1/product_variants/{id}` - Get variant
-   `PUT /api/v1/product_variants/{id}` - Update variant
-   `DELETE /api/v1/product_variants/{id}` - Delete variant

### Xem tất cả routes

```bash
php artisan route:list
php artisan route:list --path=products
```

📖 **Chi tiết:** [ROUTE_ORGANIZATION.md](./details/ROUTE_ORGANIZATION.md)

---

## 📝 Domain Logging

### Log theo từng Domain

Mỗi domain có log riêng:

```bash
# Product logs
app/Domain/Product/storage/logs/product.log

# Category logs
app/Domain/Category/storage/logs/category.log

# Brand logs
app/Domain/Brand/storage/logs/brand.log
```

### Xem logs

```bash
# Product logs (50 dòng cuối)
docker exec laravel_php tail -n 50 /var/www/html/app/Domain/Product/storage/logs/product.log

# Real-time monitoring
docker exec laravel_php tail -f /var/www/html/app/Domain/Product/storage/logs/product.log

# Category logs
docker exec laravel_php tail -f /var/www/html/app/Domain/Category/storage/logs/category.log
```

### Log Format

```php
Log::channel('product')->error('Failed to retrieve products', [
    'error' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine(),
    // 'trace' => $e->getTraceAsString()
]);
```

### API Response khi có lỗi

**Development (APP_DEBUG=true):**

```json
{
    "status": "error",
    "httpCode": 500,
    "message": "Failed to retrieve products",
    "errors": {
        "message": "Database connection failed",
        "file": "/var/www/html/app/Domain/Product/...",
        "line": 45
    }
}
```

**Production (APP_DEBUG=false):**

```json
{
    "status": "error",
    "httpCode": 500,
    "message": "Failed to retrieve products",
    "errors": null
}
```

📖 **Chi tiết:** [DOMAIN_LOGS.md](./details/DOMAIN_LOGS.md)

---

## 🔍 Elasticsearch

### Thông tin

-   **Host:** `laravel_elasticsearch:9200`
-   **Version:** 8.8.2
-   **Index:** `products`
-   **Documents:** 161,404 products indexed

### Test Elasticsearch

```bash
# Health check
curl http://localhost/api/v1/products/search/health

# Search products
curl "http://localhost/api/v1/products/search?q=iphone"

# Search by variant config
curl "http://localhost/api/v1/products/search/config?color=red&size=M"
```

### Xem Elasticsearch trực tiếp

```bash
# Cluster health
curl http://localhost:9200/_cluster/health?pretty

# Index stats
curl http://localhost:9200/products/_stats?pretty

# Search query
curl -X GET "http://localhost:9200/products/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "name": "iphone" } },
  "size": 10
}'
```

### Brand & Category Names trong Elasticsearch

Products được index với **tên đầy đủ** của brand và category (không chỉ ID):

```json
{
    "brand_id": 2,
    "brand_name": "HP",
    "category_id": 2,
    "category_name": "Laptop"
}
```

**Reindex tất cả products:**

```bash
docker exec laravel_php php artisan product:es-reindex
```

📖 **Chi tiết:**

-   [elasticsearch.md](./details/elasticsearch.md)
-   [ELASTICSEARCH_BRAND_CATEGORY_NAMES.md](./details/ELASTICSEARCH_BRAND_CATEGORY_NAMES.md)

---

## 📊 ELK Stack

### Full Stack: Elasticsearch + Logstash + Kibana

**Services:**

-   **Elasticsearch** (9200) - Search & Analytics
-   **Logstash** (5001) - Log Processing Pipeline
-   **Kibana** (5601) - Visualization & Dashboards

### Quick Access

```bash
# Kibana Dashboard
open http://localhost:5601

# Send log to Logstash
echo '{"message":"Test","level":"info"}' | nc localhost 5001

# View logs in Elasticsearch
curl "http://localhost:9200/laravel-logs-*/_search?pretty"
```

### Laravel Integration

```php
// Quick test
$fp = fsockopen('laravel_logstash', 5000);
fwrite($fp, json_encode(['message' => 'Test log', 'level' => 'info']) . "\n");
fclose($fp);

// Or use Monolog handler (recommended)
Log::channel('logstash')->info('User action', ['user_id' => 123]);
```

### Kibana Setup

1. Open: http://localhost:5601
2. Create index pattern: `laravel-logs-*`
3. Go to Discover → View logs in real-time
4. Create visualizations & dashboards

📖 **Chi tiết:** [ELK_STACK.md](./details/ELK_STACK.md)  
📖 **Setup Complete:** [../ELK_SETUP_COMPLETE.md](../ELK_SETUP_COMPLETE.md)

---

## ⚡ Kafka

-   **Documents:** 161,404 products indexed

### Test Elasticsearch

```bash
# Health check
curl http://localhost/api/v1/products/search/health

# Search products
curl "http://localhost/api/v1/products/search?q=iphone"

# Search by variant config
curl "http://localhost/api/v1/products/search/config?color=red&size=M"
```

### Xem Elasticsearch trực tiếp

```bash
# Cluster health
curl http://localhost:9200/_cluster/health?pretty

# Index stats
curl http://localhost:9200/products/_stats?pretty

# Search query
curl -X GET "http://localhost:9200/products/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "name": "iphone" } },
  "size": 10
}'
```

📖 **Chi tiết:** [elasticsearch.md](./details/elasticsearch.md)

---

## ⚡ Kafka

### Thông tin

-   **Host:** `laravel_kafka:9092`
-   **Consumer Group:** `laravel-local` (local), `laravel-production` (prod)

### Kafka Commands

```bash
# List topics
docker exec laravel_kafka kafka-topics --bootstrap-server localhost:9092 --list

# Describe topic
docker exec laravel_kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic your-topic

# Consume messages
docker exec laravel_kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic your-topic --from-beginning

# Produce message
docker exec -it laravel_kafka kafka-console-producer --bootstrap-server localhost:9092 --topic your-topic
```

📖 **Chi tiết:** [kafka.md](./details/kafka.md)

---

## 🐳 Docker

### Containers

```bash
# List running containers
docker ps

# Start all containers
docker-compose -f docker-main/docker-compose.yml up -d

# Stop all containers
docker-compose -f docker-main/docker-compose.yml down

# Restart specific container
docker restart laravel_php

# View logs
docker logs laravel_php
docker logs -f laravel_php  # Follow
```

### Services

-   `laravel_php` - PHP 8.2 + Laravel
-   `laravel_nginx` - Nginx web server
-   `laravel_mysql` - MySQL 8.0
-   `laravel_redis` - Redis cache
-   `laravel_elasticsearch` - Elasticsearch 8.8.2
-   `laravel_kafka` - Kafka message broker
-   `laravel_zookeeper` - Zookeeper (for Kafka)
-   `laravel_queue` - Laravel queue worker

### Enter containers

```bash
# PHP container
docker exec -it laravel_php bash

# MySQL container
docker exec -it laravel_mysql mysql -u laravel -p

# Redis container
docker exec -it laravel_redis redis-cli

# Elasticsearch container
docker exec -it laravel_elasticsearch bash
```

---

## 🛠️ Makefile Commands

```bash
make help          # Show all commands
make env-local     # Switch to local environment
make env-prod      # Switch to production
make env-check     # Check current environment
make env-list      # List .env files
make cache-clear   # Clear Laravel caches
```

---

## 🔧 Troubleshooting

### Container không chạy

```bash
cd docker-main
docker-compose up -d
docker ps  # Check status
```

### Permission denied

```bash
chmod +x docker-switch-env.sh
chmod +x src/switch-env.sh
```

### Cache issues

```bash
make cache-clear

# Hoặc manual
docker exec laravel_php bash -c "cd /var/www/html && php artisan optimize:clear"
```

### Elasticsearch connection failed

```bash
# Check ES health
curl http://localhost:9200/_cluster/health

# Restart ES
docker restart laravel_elasticsearch
```

### Database connection refused

```bash
# Check MySQL is running
docker ps | grep mysql

# Check credentials in .env
docker exec laravel_php cat /var/www/html/.env | grep DB_
```

---

## � Scripts

### Tất cả scripts được tập trung trong folder `scripts/`

```
scripts/
├── docker-switch-env.sh    # Switch environment trong Docker
├── switch-env.sh           # Switch environment ngoài Docker
├── env-aliases.sh          # Bash/Zsh aliases
├── kafka-control.sh        # Quản lý Kafka (interactive)
├── kafka-setup.sh          # Initial Kafka setup
├── main.sh                 # Main entry point
├── README.md               # Full documentation
└── MIGRATION.md            # Migration guide
```

### Quick Usage

```bash
# Environment switching (dùng Makefile - khuyên dùng)
make env-local
make env-prod
make env-check

# Hoặc gọi script trực tiếp
./scripts/docker-switch-env.sh local
./scripts/docker-switch-env.sh prod

# Kafka management
./scripts/kafka-control.sh

# Setup aliases
source ~/Desktop/project/scripts/env-aliases.sh
```

📖 **Chi tiết:** [../scripts/README.md](../scripts/README.md)

---

## �📚 Tham khảo thêm

-   [Laravel Documentation](https://laravel.com/docs)
-   [Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
-   [Apache Kafka](https://kafka.apache.org/documentation/)
-   [Docker Compose](https://docs.docker.com/compose/)

---

## ✅ Checklist Deploy Production

-   [ ] Review `.env.prod` file
-   [ ] Backup current `.env`
-   [ ] Run `make env-prod`
-   [ ] Verify `APP_ENV=production` và `APP_DEBUG=false`
-   [ ] Test database connection
-   [ ] Test Redis connection
-   [ ] Test Kafka connection
-   [ ] Test Elasticsearch connection
-   [ ] Clear all caches
-   [ ] Restart services
-   [ ] Monitor logs for errors

---

**Last Updated:** October 18, 2025


