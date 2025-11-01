# 🔧 ENVIRONMENT SWITCHER - HƯỚNG DẪN ĐẦY ĐỦ

## 📋 MỤC LỤC

1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)
2. [Cấu Trúc Files](#cấu-trúc-files)
3. [Cách Sử Dụng Nhanh](#cách-sử-dụng-nhanh)
4. [Cách Sử Dụng Chi Tiết](#cách-sử-dụng-chi-tiết)
5. [Cấu Hình Environment Files](#cấu-hình-environment-files)
6. [Use Cases](#use-cases)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## 📌 THÔNG TIN CƠ BẢN

### Mục đích

Dễ dàng chuyển đổi giữa các môi trường (local, production) bằng cách sử dụng file .env tương ứng từ thư mục `env-main/`.

### Cách hoạt động

Script sẽ:

1. **Backup** file `.env` hiện tại
2. **Copy** file environment mới từ `env-main/`
3. **Clear** tất cả Laravel caches
4. **Hiển thị** thông tin environment hiện tại

---

## 📁 CẤU TRÚC FILES

```
project/
├── Makefile                    # ← Make commands (khuyên dùng)
├── docker-switch-env.sh        # ← Script switch trong Docker
├── env-aliases.sh              # ← Bash aliases (tùy chọn)
└── src/
    ├── env-main/
    │   ├── .env.local          # ← Local environment config
    │   ├── .env.prod           # ← Production environment config
    │   └── .env.example        # ← Template
    ├── .env                    # ← Current active environment (auto-generated)
    └── switch-env.sh           # ← Script switch ngoài Docker
```

---

## 🚀 CÁCH SỬ DỤNG NHANH

### Sử dụng Makefile (Khuyên dùng)

```bash
cd /Users/buimanhkhuong/Desktop/project

# Switch to local
make env-local

# Switch to production
make env-prod

# Check current environment
make env-check

# Backup .env
make env-backup

# See all commands
make help
```

### Sử dụng Script trực tiếp

```bash
cd /Users/buimanhkhuong/Desktop/project

# For Docker
./docker-switch-env.sh local
./docker-switch-env.sh prod

# For non-Docker (direct PHP)
cd src
./switch-env.sh local
./switch-env.sh prod
```

### Sử dụng Aliases (Tùy chọn)

Add vào `.zshrc` hoặc `.bashrc`:

```bash
source /Users/buimanhkhuong/Desktop/project/env-aliases.sh
```

Sau đó:

```bash
env-local    # Switch to local
env-prod     # Switch to production
env-check    # Check current
env-help     # Show help
```

---

## 🔧 CÁCH SỬ DỤNG CHI TIẾT

### 1. Chạy local (ngoài Docker):

```bash
cd /Users/buimanhkhuong/Desktop/project/src

# Switch to local environment
./switch-env.sh local

# Switch to production environment
./switch-env.sh prod
# hoặc
./switch-env.sh production
```

### 2. Chạy trong Docker:

```bash
cd /Users/buimanhkhuong/Desktop/project

# Switch to local environment in Docker
./docker-switch-env.sh local

# Switch to production environment in Docker
./docker-switch-env.sh prod
```

### Output mẫu

```bash
$ ./docker-switch-env.sh local

Switching to LOCAL environment in Docker container...
Backed up current .env to .env.backup.local
Copied env-main/.env.local to .env
✓ Switched to LOCAL environment in container

Current Environment Settings:
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost
DB_HOST=laravel_mysql

Clearing Laravel caches in container...
✓ Caches cleared

✓ Environment switched successfully in Docker!
```

---

## 📝 CẤU HÌNH ENVIRONMENT FILES

### `.env.local` - Local Development

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=laravel_mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=laravel

CACHE_DRIVER=redis
REDIS_HOST=laravel_redis
REDIS_PORT=6379

# Kafka local
KAFKA_BROKERS=laravel_kafka:9092
KAFKA_CONSUMER_GROUP_ID=laravel-local

# Elasticsearch local
ELASTICSEARCH_HOST=laravel_elasticsearch
ELASTICSEARCH_PORT=9200
```

### `.env.prod` - Production

```env
APP_NAME="Production App"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=production-db-host
DB_PORT=3306
DB_DATABASE=production_db
DB_USERNAME=prod_user
DB_PASSWORD=strong-password-here

CACHE_DRIVER=redis
REDIS_HOST=production-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=redis-password-here

# Kafka production
KAFKA_BROKERS=prod-kafka-1:9092,prod-kafka-2:9092,prod-kafka-3:9092
KAFKA_CONSUMER_GROUP_ID=laravel-production

# Elasticsearch production
ELASTICSEARCH_HOST=production-es-host
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=es-password-here
```

---

## 🎯 USE CASES

### Use Case 1: Development (mặc định)

```bash
make env-local
```

### Use Case 2: Test như production trên local

```bash
make env-prod
# Test...
make env-local  # Switch back
```

### Use Case 3: Deploy lên server production

```bash
ssh production-server
cd /var/www/html
./switch-env.sh prod
sudo supervisorctl restart all
```

### Use Case 4: Debug production issue trên local

```bash
# Copy production config vào env-main/.env.prod
# Chỉnh DB_HOST về local database clone
./docker-switch-env.sh prod

# Debug...
# Switch back
./docker-switch-env.sh local
```

---

## 📊 SO SÁNH LOCAL VS PRODUCTION

| Config               | Local                   | Production    |
| -------------------- | ----------------------- | ------------- |
| `APP_ENV`            | `local`                 | `production`  |
| `APP_DEBUG`          | `true`                  | `false`       |
| `DB_HOST`            | `laravel_mysql`         | Production DB |
| `KAFKA_BROKERS`      | `laravel_kafka:9092`    | Cluster       |
| `ELASTICSEARCH_HOST` | `laravel_elasticsearch` | Cluster       |

---

## 🔍 KIỂM TRA ENVIRONMENT HIỆN TẠI

```bash
# Quick check
make env-check

# Detailed check
docker exec laravel_php bash -c "cd /var/www/html && php artisan env"

# Check file trực tiếp
docker exec laravel_php bash -c "cd /var/www/html && grep APP_ENV .env"
```

---

## 🛠️ TROUBLESHOOTING

### Container not running

```bash
cd docker-main
docker-compose up -d
```

### Permission denied

```bash
chmod +x docker-switch-env.sh
chmod +x src/switch-env.sh
```

### Cache issues

```bash
make cache-clear
# Or manual
docker exec laravel_php bash -c "cd /var/www/html && php artisan optimize:clear"
```

### env file not found

```bash
# Check files exist
ls -la /Users/buimanhkhuong/Desktop/project/src/env-main/

# Copy from example if needed
cp env-main/.env.example env-main/.env.local
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

-   ✅ `.env` is auto-generated, **never commit it**
-   ✅ Commit `env-main/.env.example`
-   ⚠️ Be careful with `env-main/.env.prod` (contains secrets)
-   ✅ Always backup before switching
-   ✅ Clear caches after switching (script does this automatically)

---

## 🎓 BEST PRACTICES

1. **Luôn backup trước khi switch**

    - Script tự động backup, nhưng double-check

2. **Test sau khi switch**

    ```bash
    # Quick test
    docker exec laravel_php bash -c "cd /var/www/html && php artisan route:list | head -5"
    ```

3. **Document thay đổi**

    - Update `env-main/.env.example` khi thêm config mới

4. **Use version control cho .env templates**

    ```bash
    git add env-main/.env.example
    git add env-main/.env.local
    # Cẩn thận với .env.prod (có thể chứa secrets)
    ```

5. **Rotate secrets thường xuyên**
    - Database passwords
    - API keys
    - Kafka/Redis passwords

---

## ✅ CHECKLIST KHI DEPLOY PRODUCTION

-   [ ] Review `env-main/.env.prod` file
-   [ ] Backup current `.env` file
-   [ ] Run `./switch-env.sh prod`
-   [ ] Verify APP_ENV=production
-   [ ] Verify APP_DEBUG=false
-   [ ] Test database connection
-   [ ] Test Redis connection
-   [ ] Test Kafka connection
-   [ ] Test Elasticsearch connection
-   [ ] Clear all caches
-   [ ] Restart services
-   [ ] Monitor logs for errors

---

## 📚 THAM KHẢO THÊM

-   Laravel Environment Configuration: https://laravel.com/docs/configuration
-   Docker Environment Variables: https://docs.docker.com/compose/environment-variables/
-   Security Best Practices: https://laravel.com/docs/deployment#server-configuration

---

**📅 Last Updated:** October 24, 2025  
**✅ Status:** Complete & Production Ready
