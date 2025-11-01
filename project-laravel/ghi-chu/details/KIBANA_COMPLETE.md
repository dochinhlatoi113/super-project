# Kibana - Complete Guide

> Hướng dẫn đầy đủ về Kibana: Setup, Security, Dashboard, và Phân quyền Read-Only

---

## 📋 Mục Lục

1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)
2. [Enable Kibana Security](#enable-kibana-security)
3. [Phân Quyền Read-Only Dashboard](#phân-quyền-read-only-dashboard)
4. [Import/Export Dashboard](#importexport-dashboard)
5. [Troubleshooting](#troubleshooting)
6. [Quick Commands](#quick-commands)

---

## Thông Tin Cơ Bản

### Truy cập Kibana

-   **URL**: http://localhost:5601
-   **Container**: `laravel_kibana`
-   **Version**: 8.8.2
-   **Port**: 5601

### Save/Load Dashboard

-   **Import Dashboard**: http://localhost:5601/app/management/kibana/objects
-   **File Format**: `.ndjson` (newline-delimited JSON)
-   **Dashboard File**: `products-dashboard.ndjson`

---

## Enable Kibana Security

### ❓ Vấn Đề: Không thấy tab Users/Roles trong Kibana

**Nguyên nhân**: Kibana Security chưa được enable (X-Pack Security disabled)

### ✅ Solution: Enable X-Pack Security

#### Bước 1: Check Security Status

```bash
# Kiểm tra security có enable không
docker exec laravel_elasticsearch curl -X GET "localhost:9200/_xpack/usage?pretty" | grep security

# Kết quả nếu chưa enable:
"security" : {
  "available" : true,
  "enabled" : false  // ← FALSE = chưa enable
}
```

#### Bước 2: Enable Security trong Docker Compose

Edit file `docker-compose.yml`:

```yaml
services:
    elasticsearch:
        image: docker.elastic.co/elasticsearch/elasticsearch:8.8.2
        container_name: laravel_elasticsearch
        environment:
            - discovery.type=single-node
            - bootstrap.memory_lock=true
            - ES_JAVA_OPTS=-Xms512m -Xmx512m
            # ✅ THÊM 2 DÒNG NÀY
            - xpack.security.enabled=true
            - xpack.security.authc.api_key.enabled=true

    kibana:
        image: docker.elastic.co/kibana/kibana:8.8.2
        container_name: laravel_kibana
        environment:
            - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
            # ✅ THÊM 3 DÒNG NÀY (sau khi set password)
            - ELASTICSEARCH_USERNAME=kibana_system
            - ELASTICSEARCH_PASSWORD=your_password_here
            - xpack.security.enabled=true
```

#### Bước 3: Restart và Setup Passwords

```bash
# 1. Stop containers
docker-compose down

# 2. Start lại với config mới
docker-compose up -d

# 3. Đợi Elasticsearch khởi động (10-15 giây)
sleep 15

# 4. Auto generate passwords cho built-in users
docker exec laravel_elasticsearch bin/elasticsearch-setup-passwords auto -b

# Lưu lại output:
# Changed password for user elastic
# PASSWORD elastic = msWrVIxIVyrLgXPwfZj4  ← LƯU PASSWORD NÀY
#
# Changed password for user kibana_system
# PASSWORD kibana_system = eR2lSk5RDBu52p63gArO  ← LƯU PASSWORD NÀY
#
# Changed password for user logstash_system
# PASSWORD logstash_system = rkHfzksj64jRlkfnRuNs
```

#### Bước 4: Update Kibana Config với Password

Edit `docker-compose.yml` lại với password thật:

```yaml
kibana:
    environment:
        - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
        - ELASTICSEARCH_USERNAME=kibana_system # ← QUAN TRỌNG: Dùng kibana_system, KHÔNG phải elastic
        - ELASTICSEARCH_PASSWORD=eR2lSk5RDBu52p63gArO # ← Password từ step 3
        - xpack.security.enabled=true
```

Recreate Kibana container:

```bash
docker-compose stop kibana
docker-compose rm -f kibana
docker-compose up -d kibana
```

#### Bước 5: Login vào Kibana

1. Mở browser: `http://localhost:5601`
2. Sẽ thấy login page
3. Login với:
    - Username: `elastic` # ← User elastic để login UI
    - Password: `msWrVIxIVyrLgXPwfZj4`

#### Bước 6: Verify Security Enabled

Sau khi login vào Kibana:

1. Click **☰** menu (hamburger) ở góc trái
2. Scroll xuống cuối
3. Click **Stack Management**
4. Trong menu bên trái, sẽ thấy section **Security** với:
    - ✅ **Users**
    - ✅ **Roles**
    - ✅ **Role Mappings**
    - ✅ **API Keys**

**Security đã enable thành công!** ✨

---

## Phân Quyền Read-Only Dashboard

### 1. Tạo Role Read-Only

#### Option A: Qua Kibana UI (Recommend)

1. Vào **Stack Management** → **Security** → **Roles**
2. Click **Create role**
3. Cấu hình:

```
Role name: dashboard_viewer

Cluster privileges: (để trống)

Index privileges:
- Indices: products
- Privileges: read, view_index_metadata

Kibana privileges:
- Spaces: Default
- Feature privileges:
  - Dashboard: Read
  - Visualize Library: Read
  - Discover: None
  - Canvas: None
  - Maps: None
  - Machine Learning: None
```

4. Click **Create role**

#### Option B: Qua API

```bash
curl -X POST "localhost:9200/_security/role/dashboard_viewer" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
    "cluster": [],
    "indices": [
      {
        "names": ["products"],
        "privileges": ["read", "view_index_metadata"]
      }
    ],
    "applications": [
      {
        "application": "kibana-.kibana",
        "privileges": ["feature_dashboard.read", "feature_visualize.read"],
        "resources": ["space:default"]
      }
    ]
  }'
```

### 2. Tạo User Read-Only

#### Qua Kibana UI:

1. Vào **Stack Management** → **Security** → **Users**
2. Click **Create user**

```
Username: viewer
Password: viewer123
Full name: Dashboard Viewer
Email: viewer@company.com
Roles: dashboard_viewer  ← Select role vừa tạo
```

3. Click **Create user**

#### Qua API:

```bash
curl -X POST "localhost:9200/_security/user/viewer" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
    "password": "viewer123",
    "roles": ["dashboard_viewer"],
    "full_name": "Dashboard Viewer",
    "email": "viewer@company.com"
  }'
```

### 3. Share Dashboard

#### Cách 1: Dashboard Link với Authentication (Recommend)

1. Mở Dashboard trong Kibana
2. Click **Share** → **Get link**
3. Copy link: `http://localhost:5601/app/dashboards#/view/products-dashboard`
4. Share link này
5. User login với:
    - Username: `viewer`
    - Password: `viewer123`
6. User chỉ có quyền XEM, không edit/delete

#### Cách 2: Short URL

1. Mở Dashboard trong Kibana
2. Click **Share** → **Get link**
3. Chọn **Short URL**
4. Copy link: `http://localhost:5601/goto/xxxx`
5. Share link ngắn gọn hơn

#### Cách 3: Anonymous Access (Public, không cần login)

Trong `kibana.yml`:

```yaml
xpack.security.authc.providers:
    basic.basic1:
        order: 0
    anonymous.anonymous1:
        order: 1
        credentials:
            username: 'anonymous_user'
            password: 'anonymous_password'
```

Tạo anonymous user:

```bash
curl -X POST "localhost:9200/_security/user/anonymous_user" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
    "password": "anonymous_password",
    "roles": ["dashboard_viewer"]
  }'
```

#### Cách 4: Embedded Dashboard (IFrame)

Trong `kibana.yml`:

```yaml
server.customResponseHeaders:
    X-Frame-Options: 'SAMEORIGIN'

# Hoặc cho phép từ domain cụ thể
csp.frame-ancestors: ["'self'", 'https://yourdomain.com']
```

Embed trong HTML:

```html
<iframe
    src="http://localhost:5601/app/dashboards#/view/products-dashboard?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))"
    height="600"
    width="800"
>
</iframe>
```

### 4. Link Dashboard Examples

```bash
# Link cơ bản
http://localhost:5601/app/dashboards#/view/products-dashboard

# Link với filters
http://localhost:5601/app/dashboards#/view/products-dashboard?_g=(filters:!((query:(match_phrase:(brand_name:Samsung)))))

# Link với time range
http://localhost:5601/app/dashboards#/view/products-dashboard?_g=(time:(from:now-30d,to:now))

# Link embedded (read-only)
http://localhost:5601/app/dashboards#/view/products-dashboard?embed=true&_g=(refreshInterval:(pause:!t,value:0))
```

### 5. Tạo Space riêng cho Public Dashboards (Advanced)

#### Bước 1: Tạo Space mới

1. **Stack Management** → **Kibana** → **Spaces**
2. Click **Create a space**

```
Name: Public Dashboards
URL identifier: public
Description: Space for public read-only dashboards
```

#### Bước 2: Copy Dashboard vào Space mới

1. Vào Dashboard → **Products Analytics Dashboard**
2. Click **Share** → **Copy to space**
3. Chọn **Public Dashboards**

#### Bước 3: Tạo Role cho Space này

```bash
curl -X POST "localhost:9200/_security/role/public_dashboard_viewer" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
    "cluster": [],
    "indices": [
      {
        "names": ["products"],
        "privileges": ["read"]
      }
    ],
    "applications": [
      {
        "application": "kibana-.kibana",
        "privileges": ["feature_dashboard.read"],
        "resources": ["space:public"]
      }
    ]
  }'
```

### 7. Permission Comparison Table

| Feature          | Admin (elastic) | Viewer (dashboard_viewer) |
| ---------------- | --------------- | ------------------------- |
| Dashboard - View | ✅              | ✅                        |
| Dashboard - Edit | ✅              | ❌                        |
| Discover         | ✅              | ✅ (read-only)            |
| Visualize        | ✅              | ✅ (read-only)            |
| Stack Management | ✅              | ❌ (ẨN)                   |
| Dev Tools        | ✅              | ❌ (ẨN)                   |
| Users/Roles      | ✅              | ❌ (ẨN)                   |
| Index Management | ✅              | ❌ (ẨN)                   |
| Create Dashboard | ✅              | ❌                        |
| Delete Dashboard | ✅              | ❌                        |

### 8. Advanced Role Configurations

#### Dashboard Only Role (Ẩn cả Discover và Visualize)

```bash
curl -X POST "localhost:9200/_security/role/dashboard_only" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
  "indices": [
    {
      "names": ["products"],
      "privileges": ["read"]
    }
  ],
  "applications": [
    {
      "application": "kibana-.kibana",
      "privileges": ["feature_dashboard.read"],
      "resources": ["space:default"]
    }
  ]
}'
```

**Kết quả:**

-   ✅ Dashboard tab
-   ❌ Discover tab (ẨN)
-   ❌ Visualize tab (ẨN)
-   ❌ Stack Management (ẨN)

#### Specific Dashboard Viewer (Chỉ xem dashboard cụ thể)

```bash
curl -X POST "localhost:9200/_security/role/specific_dashboard_viewer" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
  "indices": [
    {
      "names": ["products"],
      "privileges": ["read"]
    }
  ],
  "applications": [
    {
      "application": "kibana-.kibana",
      "privileges": ["feature_dashboard.read"],
      "resources": ["dashboard:abc123"]
    }
  ]
}'
```

### 9. Detailed Troubleshooting

#### Vẫn thấy Stack Management tab?

**Nguyên nhân:** User có nhiều roles, 1 trong số đó có quyền cao hơn.

**Giải pháp:**

```bash
# Check roles của user
curl -u elastic:msWrVIxIVyrLgXPwfZj4 \
  "localhost:9200/_security/user/viewer"

# Xóa roles thừa, chỉ giữ dashboard_viewer
curl -X PUT "localhost:9200/_security/user/viewer" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
  "password": "viewer123",
  "roles": ["dashboard_viewer"]
}'
```

#### User không thấy data trong Dashboard?

**Nguyên nhân:** Thiếu index privileges.

**Giải pháp:**

```bash
# Update role để add thêm indices
curl -X POST "localhost:9200/_security/role/dashboard_viewer" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{
  "indices": [
    {
      "names": ["products", "kafka-*", "laravel-logs-*"],
      "privileges": ["read", "view_index_metadata"]
    }
  ],
  "applications": [...]
}'
```

---

## Import/Export Dashboard

### Export Dashboard

1. Vào **Stack Management** → **Saved Objects**
2. Tìm và chọn dashboard muốn export
3. Click **Export**
4. File `.ndjson` sẽ được download

### Import Dashboard

1. Vào **Stack Management** → **Saved Objects**
2. Click **Import**
3. Chọn file `products-dashboard.ndjson`
4. Click **Import**
5. Xử lý conflicts nếu có:
    - **Overwrite**: Ghi đè dashboard cũ
    - **Skip**: Bỏ qua, giữ dashboard cũ

### Dashboard File Location

```bash
# Project dashboard file
/Users/buimanhkhuong/Desktop/project/products-dashboard.ndjson

# Import URL
http://localhost:5601/app/management/kibana/objects
```

---

## Troubleshooting

### ❌ Không thấy tab Users/Roles

**Giải pháp**: Enable security theo hướng dẫn [Enable Kibana Security](#enable-kibana-security)

### ❌ Lỗi: "security_exception: missing authentication credentials"

**Giải pháp**: Thêm username/password vào request

```bash
# Trước (không auth)
curl http://localhost:9200/products/_search

# Sau (có auth)
curl -u elastic:msWrVIxIVyrLgXPwfZj4 'http://localhost:9200/products/_search?pretty'
```

### ❌ Kibana không kết nối được Elasticsearch

**Check logs**:

```bash
docker logs laravel_kibana --tail 50
```

**Giải pháp**:

1. Kiểm tra `ELASTICSEARCH_USERNAME` và `ELASTICSEARCH_PASSWORD` trong docker-compose.yml
2. Đảm bảo dùng user `kibana_system`, KHÔNG phải `elastic`
3. Restart Kibana:
    ```bash
    docker-compose stop kibana
    docker-compose rm -f kibana
    docker-compose up -d kibana
    ```

### ❌ Lỗi: "Password has already been set"

**Giải pháp 1**: Reset về default

```bash
docker-compose down -v  # XÓA volumes
docker-compose up -d
docker exec laravel_elasticsearch bin/elasticsearch-setup-passwords auto -b
```

**Giải pháp 2**: Change password

```bash
curl -X POST "localhost:9200/_security/user/elastic/_password" \
  -H 'Content-Type: application/json' \
  -u elastic:old_password \
  -d '{"password":"new_password"}'
```

### ❌ Import Dashboard lỗi version mismatch

**Lỗi**: "Document belongs to a more recent version"

**Giải pháp**: Dashboard file version cao hơn Kibana version

-   Kibana 8.7.0 chỉ import được dashboard từ 8.7.0 trở xuống
-   Kibana 8.8.2 import được dashboard 8.8.2 và thấp hơn
-   Sửa `coreMigrationVersion` và `typeMigrationVersion` trong file `.ndjson`

### ❌ Runtime field "max_config_price" = 0

**Nguyên nhân**: Runtime field script dùng `doc[]` không work với nested fields

**Giải pháp**: Dùng `params._source`

```json
{
    "max_config_price": {
        "type": "double",
        "script": {
            "source": "double maxPrice = 0.0; if (params['_source']['variants'] != null) { for (variant in params['_source']['variants']) { if (variant['config'] != null) { for (config in variant['config']) { if (config['price'] != null && config['price'] > maxPrice) { maxPrice = config['price']; } } } } } emit(maxPrice);"
        }
    }
}
```

---

## Quick Commands

### Security Management

```bash
# Check security status
curl -u elastic:msWrVIxIVyrLgXPwfZj4 'http://localhost:9200/_xpack/usage?pretty' | grep -A 5 security

# Test auth
curl -u elastic:msWrVIxIVyrLgXPwfZj4 http://localhost:9200

# Get cluster health
curl -u elastic:msWrVIxIVyrLgXPwfZj4 'http://localhost:9200/_cluster/health?pretty'

# List all users
curl -u elastic:msWrVIxIVyrLgXPwfZj4 'http://localhost:9200/_security/user?pretty'

# List all roles
curl -u elastic:msWrVIxIVyrLgXPwfZj4 'http://localhost:9200/_security/role?pretty'
```

### Docker Commands

```bash
# Check Kibana logs
docker logs laravel_kibana --tail 50
docker logs laravel_kibana -f  # Follow logs

# Restart Kibana
docker-compose restart kibana

# Recreate Kibana (khi đổi config)
docker-compose stop kibana
docker-compose rm -f kibana
docker-compose up -d kibana

# Check Elasticsearch logs
docker logs laravel_elasticsearch --tail 50
```

### Password Management

```bash
# Reset password cho user
docker exec laravel_elasticsearch bin/elasticsearch-reset-password -u elastic

# Setup tất cả passwords (auto)
docker exec laravel_elasticsearch bin/elasticsearch-setup-passwords auto -b

# Setup tất cả passwords (interactive)
docker exec laravel_elasticsearch bin/elasticsearch-setup-passwords interactive

# Change password qua API
curl -X POST "localhost:9200/_security/user/viewer/_password" \
  -H 'Content-Type: application/json' \
  -u elastic:msWrVIxIVyrLgXPwfZj4 \
  -d '{"password":"new_password"}'
```

---

## Security Best Practices

### ✅ Nên làm:

1. **Dùng HTTPS** trong production
2. **Set strong password** cho tất cả users
3. **Limit IP access** qua nginx/firewall
4. **Enable audit logging**:
    ```yaml
    xpack.security.audit.enabled: true
    ```
5. **Set expiration** cho API keys
6. **Regular review** user permissions
7. **Separate spaces** cho public/private dashboards
8. **Backup passwords** vào file secure (không commit vào git)

### ❌ Không nên:

1. Dùng user `elastic` cho Kibana service (dùng `kibana_system`)
2. Dùng user `elastic` cho public access
3. Share password qua email/chat
4. Để anonymous access không có role
5. Allow tất cả indices cho viewer role
6. Commit passwords vào git repository

---

## Summary Checklist

### Enable Security:

-   [ ] Add `xpack.security.enabled=true` vào elasticsearch
-   [ ] Add `xpack.security.authc.api_key.enabled=true` vào elasticsearch
-   [ ] Restart containers: `docker-compose down && docker-compose up -d`
-   [ ] Setup passwords: `docker exec laravel_elasticsearch bin/elasticsearch-setup-passwords auto -b`
-   [ ] Update Kibana với `kibana_system` credentials
-   [ ] Recreate Kibana container
-   [ ] Login Kibana với user `elastic`
-   [ ] Verify: Stack Management → Security → Users/Roles

### Tạo Viewer Account:

-   [ ] Login Kibana với user `elastic`
-   [ ] Create role `dashboard_viewer` với read-only privileges
-   [ ] Create user `viewer` với role `dashboard_viewer`
-   [ ] Test login với user `viewer`
-   [ ] Share dashboard link
-   [ ] Verify user chỉ có quyền xem

---

**Updated**: 2025-10-19  
**Kibana Version**: 8.8.2  
**Elasticsearch Version**: 8.8.2
