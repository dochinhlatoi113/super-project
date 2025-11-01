# 📘 ELASTICSEARCH - HƯỚNG DẪN ĐẦY ĐỦ

## 📋 MỤC LỤC

1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)
2. [Cấu Hình & Authentication](#cấu-hình--authentication)
3. [Data Structure & Mappings](#data-structure--mappings)
4. [Khởi Động & Kiểm Tra](#khởi-động--kiểm-tra)
5. [Index Management](#index-management)
6. [Search API & Queries](#search-api--queries)
7. [Brand Name & Category Name](#brand-name--category-name)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Queries](#advanced-queries)

---

## 📌 THÔNG TIN CƠ BẢN

### Thông số kỹ thuật

-   **Version:** Elasticsearch 8.8.2
-   **Port:** 9200
-   **Container:** laravel_elasticsearch
-   **Index chính:** products
-   **Laravel Service:** ProductElasticsearchService

### Kiến trúc trong Project

```
Laravel App
├── Product Model (MySQL)
├── ProductElasticsearchService
└── Elasticsearch Index: products
    ├── Basic fields: id, name, slug, is_active
    ├── Relations: brand_name, category_name
    ├── Nested: variants (with config)
    └── Timestamps: created_at, updated_at
```

---

## 🔐 CẤU HÌNH & AUTHENTICATION

### Built-in Users

| User                | Username        | Password             | Purpose                 |
| ------------------- | --------------- | -------------------- | ----------------------- |
| **elastic**         | elastic         | msWrVIxIVyrLgXPwfZj4 | Superuser - Full access |
| **kibana_system**   | kibana_system   | eR2lSk5RDBu52p63gArO | Kibana integration      |
| **logstash_system** | logstash_system | rkHfzksj64jRlkfnRuNs | Logstash ingestion      |

### Truy cập từ ngoài

-   **Kibana:** http://localhost:5601
-   **Elasticsearch API:** http://localhost:9200
-   **Authentication:** Basic Auth với user elastic

### Ví dụ curl commands

```bash
# Check cluster health
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/_cluster/health?pretty

# List all indices
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/_cat/indices?v

# Check products index
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products
```

---

## 📊 DATA STRUCTURE & MAPPINGS

### Products Index Structure

```
products (index)
├── id (integer) - Product ID
├── name (text) - Product name
├── slug (keyword) - URL slug
├── brand_id (integer) - Brand ID
├── brand_name (text) - Brand name (joined)
├── category_id (integer) - Category ID
├── category_name (text) - Category name (joined)
├── is_active (boolean) - Active status
├── created_at (date) - Creation timestamp
├── updated_at (date) - Update timestamp
└── variants (nested object)
    ├── id (integer) - Variant ID
    ├── name (text) - Variant name
    ├── price (float) - Price
    ├── stock (integer) - Stock quantity
    ├── is_active (boolean) - Variant active status
    └── config (nested array)
        ├── color (keyword) - Color
        ├── size (keyword) - Size
        ├── storage (keyword) - Storage capacity
        ├── price (float) - Config price
        ├── stock (integer) - Config stock
        ├── is_active (boolean) - Config active
        └── income_number (integer) - Income tracking
```

### Mapping Definition

```json
{
    "mappings": {
        "properties": {
            "id": { "type": "integer" },
            "name": { "type": "text", "analyzer": "standard" },
            "slug": { "type": "keyword" },
            "brand_id": { "type": "integer" },
            "brand_name": { "type": "text", "analyzer": "standard" },
            "category_id": { "type": "integer" },
            "category_name": { "type": "text", "analyzer": "standard" },
            "is_active": { "type": "boolean" },
            "created_at": { "type": "date", "format": "yyyy-MM-dd HH:mm:ss" },
            "updated_at": { "type": "date", "format": "yyyy-MM-dd HH:mm:ss" },
            "variants": {
                "type": "nested",
                "properties": {
                    "id": { "type": "integer" },
                    "name": { "type": "text" },
                    "price": { "type": "float" },
                    "stock": { "type": "integer" },
                    "is_active": { "type": "boolean" },
                    "config": {
                        "type": "nested",
                        "properties": {
                            "color": { "type": "keyword" },
                            "size": { "type": "keyword" },
                            "storage": { "type": "keyword" },
                            "price": { "type": "float" },
                            "stock": { "type": "integer" },
                            "is_active": { "type": "boolean" },
                            "income_number": { "type": "integer" }
                        }
                    }
                }
            }
        }
    }
}
```

---

## 🚀 KHỞI ĐỘNG & KIỂM TRA

### Khởi động Elasticsearch

```bash
# Start all services
cd /Users/buimanhkhuong/Desktop/project/docker-main
docker-compose up -d

# Check container status
docker ps | grep elasticsearch
```

### Kiểm tra Health

```bash
# Cluster health
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/_cluster/health?pretty

# Node info
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/_nodes?pretty

# Basic info
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200
```

### Expected Response

```json
{
    "name": "laravel_elasticsearch",
    "cluster_name": "docker-cluster",
    "version": {
        "number": "8.8.2",
        "build_flavor": "default"
    },
    "tagline": "You Know, for Search"
}
```

---

## 🛠️ INDEX MANAGEMENT

### Khởi tạo Index

```bash
# Via Laravel Artisan
docker exec laravel_php php artisan product:es-init

# Via Docker (alternative)
docker exec laravel_php bash -c "cd /var/www/html && php artisan product:es-init"
```

### Reindex Data

```bash
# Full reindex from MySQL to ES
docker exec laravel_php php artisan product:es-reindex

# Reindex with progress
docker exec laravel_php php artisan product:es-reindex --verbose
```

### Delete & Recreate Index

```bash
# One-liner: Delete + Recreate + Reindex
docker exec laravel_php bash -c "
  curl -X DELETE 'http://laravel_elasticsearch:9200/products' 2>/dev/null && \
  php artisan product:es-init && \
  sleep 2 && \
  php artisan product:es-reindex --no-ansi
" | head -50
```

### Index Operations

```bash
# Check if index exists
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products

# Get index mapping
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products/_mapping?pretty

# Count documents
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products/_count

# Delete index
curl -X DELETE -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products
```

---

## 🔍 SEARCH API & QUERIES

### Laravel Search API

**Base URL:** `/api/v1/products/search`

**Parameters:**

-   `q` - Search query (text)
-   `brand_name` - Filter by brand
-   `category_name` - Filter by category
-   `price_min` - Minimum price
-   `price_max` - Maximum price
-   `is_active` - Active status (true/false)
-   `page` - Page number
-   `per_page` - Items per page

### Examples

```bash
# Text search
GET /api/v1/products/search?q=laptop

# Filter by brand and category
GET /api/v1/products/search?brand_name=HP&category_name=Laptops

# Price range
GET /api/v1/products/search?price_min=100&price_max=500

# Combined filters
GET /api/v1/products/search?q=macbook&brand_name=Apple&price_max=2000
```

### Direct Elasticsearch Queries

```bash
# Simple text search
curl -X GET -u elastic:msWrVIxIVyrLgXPwfZj4 \
  "http://localhost:9200/products/_search?q=laptop&pretty"

# Complex query with JSON
curl -X GET -u elastic:msWrVIxIVyrLgXPwfZj4 \
  "http://localhost:9200/products/_search" \
  -H 'Content-Type: application/json' \
  -d @query.json
```

---

## 🔗 BRAND NAME & CATEGORY NAME

### Tại sao cần Brand Name & Category Name?

-   **Performance:** Tránh JOIN queries phức tạp
-   **Search Quality:** Tìm kiếm theo tên brand/category
-   **Data Consistency:** Đảm bảo data trong ES luôn sync với MySQL

### Cách hoạt động

1. **Trong ProductService:** Khi create/update product

    ```php
    $product->load(['brand', 'category', 'variants']);
    $this->elasticsearchService->index($product);
    ```

2. **Data Structure:** Product được index với brand_name, category_name

3. **Search:** Có thể search và filter theo brand_name, category_name

### Kiểm tra Brand/Category Names

```bash
# Check if brand_name exists in mapping
curl -u elastic:msWrVIxIVyrLgXPwfZj4 \
  "http://localhost:9200/products/_mapping?pretty" | grep brand_name

# Sample document
curl -u elastic:msWrVIxIVyrLgXPwfZj4 \
  "http://localhost:9200/products/_search?size=1&pretty" | grep -A5 "brand_name"
```

### Fix nếu Brand/Category Names bị null

```bash
# Reindex all products
docker exec laravel_php php artisan product:es-reindex

# Or recreate index completely
docker exec laravel_php bash -c "
  curl -X DELETE 'http://laravel_elasticsearch:9200/products' 2>/dev/null && \
  php artisan product:es-init && \
  sleep 2 && \
  php artisan product:es-reindex
"
```

---

## 🐛 TROUBLESHOOTING

### 1. Elasticsearch không start

**Symptoms:** Container exits immediately

**Solutions:**

```bash
# Check logs
docker logs laravel_elasticsearch

# Check memory
docker stats laravel_elasticsearch

# Increase memory in docker-compose.yml
environment:
  - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
```

### 2. Index không tồn tại

**Symptoms:** Search returns empty, index not found

**Solutions:**

```bash
# Create index
docker exec laravel_php php artisan product:es-init

# Check if created
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200/products
```

### 3. Data không sync với MySQL

**Symptoms:** Search results outdated

**Solutions:**

```bash
# Reindex all data
docker exec laravel_php php artisan product:es-reindex

# Check count matches MySQL
docker exec laravel_mysql mysql -u laravel -plaravel laravel \
  -e "SELECT COUNT(*) FROM products WHERE is_active = 1;"

curl -u elastic:msWrVIxIVyrLgXPwfZj4 \
  http://localhost:9200/products/_count
```

### 4. Brand/Category names bị null

**Symptoms:** brand_name: null, category_name: null

**Solutions:**

```bash
# This usually means old index, need full reindex
docker exec laravel_php php artisan product:es-reindex

# Or check ProductService is loading relations
# In ProductService.php, ensure:
$product->load(['brand', 'category', 'variants']);
```

### 5. Memory issues

**Symptoms:** Circuit breaker errors, out of memory

**Solutions:**

```yaml
# In docker-compose.yml
services:
    elasticsearch:
        environment:
            - 'ES_JAVA_OPTS=-Xms2g -Xmx2g' # Increase heap
            - 'ES_MAX_MEMORY=2g' # Max memory
```

### 6. Connection refused

**Symptoms:** Cannot connect to Elasticsearch

**Solutions:**

```bash
# Check container is running
docker ps | grep elasticsearch

# Check port mapping
docker port laravel_elasticsearch

# Test connection
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200
```

### 7. Authentication failed

**Symptoms:** 401 Unauthorized

**Solutions:**

```bash
# Use correct credentials
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200

# Check if security is enabled
curl http://localhost:9200  # Should return auth required
```

---

## 🔬 ADVANCED QUERIES

### Complex Search với Filters

```json
{
    "query": {
        "bool": {
            "must": [
                {
                    "multi_match": {
                        "query": "laptop",
                        "fields": ["name^3", "brand_name^2", "category_name^2", "slug"],
                        "fuzziness": "AUTO"
                    }
                }
            ],
            "filter": [
                { "match": { "brand_name": "HP" } },
                { "match": { "category_name": "Laptops" } },
                { "term": { "is_active": true } },
                {
                    "nested": {
                        "path": "variants",
                        "query": {
                            "bool": {
                                "must": [
                                    { "range": { "variants.price": { "gte": 300, "lte": 500 } } },
                                    { "term": { "variants.is_active": true } }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    },
    "sort": [{ "created_at": { "order": "desc" } }],
    "size": 20,
    "from": 0
}
```

### Nested Query cho Variants

```json
{
    "query": {
        "nested": {
            "path": "variants.config",
            "query": {
                "bool": {
                    "must": [
                        { "term": { "variants.config.color": "red" } },
                        { "term": { "variants.config.size": "M" } },
                        { "range": { "variants.config.price": { "lte": 100 } } }
                    ]
                }
            }
        }
    }
}
```

### Aggregation Examples

```json
{
    "size": 0,
    "aggs": {
        "brands": {
            "terms": { "field": "brand_name.keyword", "size": 10 }
        },
        "categories": {
            "terms": { "field": "category_name.keyword", "size": 10 }
        },
        "price_ranges": {
            "range": {
                "field": "variants.price",
                "ranges": [{ "to": 100 }, { "from": 100, "to": 500 }, { "from": 500, "to": 1000 }, { "from": 1000 }]
            }
        }
    }
}
```

---

## 📚 LIÊN QUAN

-   **Kibana:** [KIBANA_COMPLETE.md](./KIBANA_COMPLETE.md) - Visualization & Dashboards
-   **Kafka:** [KAFKA_COMPLETE.md](./KAFKA_COMPLETE.md) - Event-driven sync to ES
-   **Docker:** [DOCKER_COMPLETE.md](./DOCKER_COMPLETE.md) - Container management
-   **Laravel Routes:** [LARAVEL_ROUTES.md](./LARAVEL_ROUTES.md) - API endpoints

### External Resources

-   [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
-   [Elasticsearch Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
-   [Laravel Scout](https://laravel.com/docs/scout) (alternative to custom service)

---

## ✅ CHECKLIST

-   [x] Elasticsearch container running
-   [x] Products index created with correct mapping
-   [x] Data synced from MySQL (brand_name, category_name populated)
-   [x] Search API working
-   [x] Authentication configured
-   [x] Memory settings appropriate
-   [x] Backup strategy for index
-   [ ] Monitoring setup (optional)
-   [ ] Performance tuning (optional)

---

**📅 Last Updated:** October 24, 2025  
**✅ Status:** Complete & Production Ready
