# ⚡ Quick Start Guide

> Hướng dẫn nhanh để bắt đầu với project

---

## 🚀 3 bước bắt đầu

### 1. Start Docker

```bash
cd /Users/buimanhkhuong/Desktop/project/docker-main
docker-compose up -d
```

### 2. Switch to Local Environment

```bash
cd /Users/buimanhkhuong/Desktop/project
make env-local
```

### 3. Test API

```bash
# List products
curl http://localhost/api/v1/products

# Search with Elasticsearch
curl "http://localhost/api/v1/products/search?q=iphone"
```

---

## 📖 Đọc thêm

- **[README.md](./README.md)** - Tài liệu tổng hợp
- **[INDEX.md](./INDEX.md)** - Navigation đầy đủ
- **[details/](./details/)** - Chi tiết từng topic

---

## 🛠️ Commands thường dùng

```bash
# Environment
make env-local     # Switch to local
make env-prod      # Switch to production
make env-check     # Check current environment

# Docker
docker ps          # List containers
docker logs laravel_php -f    # View logs

# Laravel
docker exec laravel_php php artisan route:list
docker exec laravel_php php artisan cache:clear
```

---

## 🎯 Cấu trúc ngắn gọn

```
ghi-chu/
├── README.md           # ← Bắt đầu từ đây
├── INDEX.md            # Navigation
├── QUICK_START.md      # File này
└── details/            # Chi tiết từng topic
    ├── ENVIRONMENT_SWITCHER.md
    ├── ROUTE_ORGANIZATION.md
    ├── DOMAIN_LOGS.md
    └── ...
```

---

**Tip:** Đọc README.md trước! ��
