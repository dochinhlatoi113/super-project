# 📚 Documentation Index

> Tổng hợp tất cả tài liệu hướng dẫn của project

---

## 📘 TÀI LIỆU COMPLETE (Ưu tiên đọc)

Các file này đã được gộp và tổng hợp đầy đủ, **đọc file này trước**:

| File                                                     | Mô tả                                                                       | Trạng thái  |
| -------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| [KIBANA_COMPLETE.md](./KIBANA_COMPLETE.md)               | Tất cả về Kibana: Setup, Security, Phân quyền, Dashboard, Troubleshooting   | ✅ Complete |
| [ELASTICSEARCH_COMPLETE.md](./ELASTICSEARCH_COMPLETE.md) | Tất cả về Elasticsearch: Index, Mapping, Search API, Aggregations, Commands | ✅ Complete |
| [KAFKA_COMPLETE.md](./KAFKA_COMPLETE.md)                 | Tất cả về Kafka: Events, Consumers, Topics, Monitoring qua Kibana           | ✅ Complete |
| [DOCKER_COMPLETE.md](./DOCKER_COMPLETE.md)               | Tất cả về Docker: Containers, Commands, Logs, Database, Troubleshooting     | ✅ Complete |
| [LARAVEL_ROUTES.md](./LARAVEL_ROUTES.md)                 | Tất cả về Laravel Routes: DDD Structure, Product/Category/Brand Routes      | ✅ Complete |

---

## 📁 TÀI LIỆU CHI TIẾT (Reference)

Các file nhỏ lẻ còn lại cho mục đích tham khảo:

### ELK Stack & Environment

-   [ELK_STACK.md](./ELK_STACK.md) - Tổng quan ELK Stack
-   [ENVIRONMENT_COMPLETE.md](./ENVIRONMENT_COMPLETE.md) - Hướng dẫn đầy đủ Environment Switcher (gộp từ ENVIRONMENT_SWITCHER.md + ENV_SWITCHER_README.md)

### Project Structure & Others

-   [cau-truc.md](./cau-truc.md) - Cấu trúc project
-   [kho.md](./kho.md) - Ghi chú kho
-   [DOMAIN_LOGS.md](./DOMAIN_LOGS.md) - Domain logging
-   [TEST_SLUG_OPERATIONS.md](./TEST_SLUG_OPERATIONS.md) - Test slug operations

### Security (⚠️ PRIVATE - Không commit)

-   [ELASTICSEARCH_PASSWORDS.txt](./ELASTICSEARCH_PASSWORDS.txt) - Passwords Elasticsearch

---

## 🚀 Quick Start

### 1. Setup Docker & Containers

\`\`\`bash

# Đọc hướng dẫn Docker

DOCKER_COMPLETE.md
\`\`\`

### 2. Setup Elasticsearch & Search API

\`\`\`bash

# Đọc hướng dẫn Elasticsearch

ELASTICSEARCH_COMPLETE.md
\`\`\`

### 3. Setup Kibana & Dashboard

\`\`\`bash

# Đọc hướng dẫn Kibana

KIBANA_COMPLETE.md
\`\`\`

### 4. Setup Kafka & Events

\`\`\`bash

# Đọc hướng dẫn Kafka

KAFKA_COMPLETE.md
\`\`\`

### 5. Hiểu Laravel Routes Structure

\`\`\`bash

# Đọc hướng dẫn Laravel Routes

LARAVEL_ROUTES.md
\`\`\`

---

## 📖 Cách Đọc - Bạn muốn...

### Kibana

**Enable Kibana Security?**  
→ \`KIBANA_COMPLETE.md\` > Section "Enable Kibana Security"

**Tạo Read-Only Dashboard User?**  
→ \`KIBANA_COMPLETE.md\` > Section "Phân Quyền Read-Only Dashboard"

**Import Dashboard?**  
→ \`KIBANA_COMPLETE.md\` > Section "Import/Export Dashboard"

**Troubleshooting Kibana?**  
→ \`KIBANA_COMPLETE.md\` > Section "Troubleshooting"

### Elasticsearch

**Khởi tạo Elasticsearch Index?**  
→ \`ELASTICSEARCH_COMPLETE.md\` > Section "Cài Đặt & Khởi Động"

**Search Products API?**  
→ \`ELASTICSEARCH_COMPLETE.md\` > Section "Product Search API"

**Brand Name & Category Name trong ES?**  
→ \`ELASTICSEARCH_COMPLETE.md\` > Section "Brand Name & Category Name trong Index"

**Troubleshooting ES?**  
→ \`ELASTICSEARCH_COMPLETE.md\` > Section "Troubleshooting"

### Kafka

**Start Kafka Consumers?**  
→ \`KAFKA_COMPLETE.md\` > Section "Kafka Consumers"

**Monitor Kafka qua Kibana?**  
→ \`KAFKA_COMPLETE.md\` > Section "Giám sát Kafka bằng Kibana"

**Manage Kafka Topics?**  
→ \`KAFKA_COMPLETE.md\` > Section "Commands & Quản Lý"

**Troubleshooting Kafka?**  
→ \`KAFKA_COMPLETE.md\` > Section "Troubleshooting"

### Docker

**Docker Commands?**  
→ \`DOCKER_COMPLETE.md\` > Section "Container Management"

**Database Operations?**  
→ \`DOCKER_COMPLETE.md\` > Section "Database Operations"

**Laravel Commands trong Docker?**  
→ \`DOCKER_COMPLETE.md\` > Section "Laravel Commands"

**Troubleshooting Docker?**  
→ \`DOCKER_COMPLETE.md\` > Section "Troubleshooting"

### Laravel Routes

**Tại sao Product có nhiều Route Files?**  
→ \`LARAVEL_ROUTES.md\` > Section "Tại sao Product có nhiều Route Files"

**Hiểu DDD Route Structure?**  
→ \`LARAVEL_ROUTES.md\` > Section "Route Organization - DDD Structure"

**Test Routes?**  
→ \`LARAVEL_ROUTES.md\` > Section "Testing Routes"

**Tạo Domain mới?**  
→ \`LARAVEL_ROUTES.md\` > Section "Tạo Domain Mới với Routes"

---

## 🔄 Migration Status

### ✅ Completed (Đã gộp xong)

| Từ                                                                                      | Thành                     | Số Files |
| --------------------------------------------------------------------------------------- | ------------------------- | -------- |
| KIBANA_SECURITY.md, ENABLE_KIBANA_SECURITY.md, Kibana.md, KIBANA_READONLY_ROLE_SETUP.md | KIBANA_COMPLETE.md        | 4 → 1    |
| elasticsearch.md, ELASTICSEARCH_BRAND_CATEGORY_NAMES.md, PRODUCT_SEARCH_API.md          | ELASTICSEARCH_COMPLETE.md | 3 → 1    |
| ENVIRONMENT_SWITCHER.md, ENV_SWITCHER_README.md                                         | ENVIRONMENT_COMPLETE.md   | 2 → 1    |
| kafka.md, KAFKA_CONSUMERS.md, KAFKA_KIBANA_MONITORING.md                                | KAFKA_COMPLETE.md         | 3 → 1    |
| DOCKER_COMMANDS.md, run.md                                                              | DOCKER_COMPLETE.md        | 2 → 1    |
| ROUTE_ORGANIZATION.md, WHY_MULTIPLE_ROUTE_FILES.md                                      | LARAVEL_ROUTES.md         | 2 → 1    |

**Tổng cộng:** Đã gộp **16 files → 6 files COMPLETE**

---

## 🎯 Khuyến nghị đọc theo thứ tự

Nếu bạn mới tham gia project, đọc theo thứ tự này:

1. **DOCKER_COMPLETE.md** - Hiểu containers và commands cơ bản
2. **ELASTICSEARCH_COMPLETE.md** - Hiểu search engine và indexing
3. **KAFKA_COMPLETE.md** - Hiểu event-driven architecture
4. **KIBANA_COMPLETE.md** - Hiểu visualization và monitoring
5. **LARAVEL_ROUTES.md** - Hiểu route structure và API endpoints

---

## 📊 Thống kê Documentation

-   **Total files:** ~15 files
-   **Complete files:** 5 files (comprehensive)
-   **Reference files:** ~9 files (nhỏ lẻ)
-   **Security files:** 1 file (⚠️ PRIVATE)
-   **Total pages:** ~500 pages nội dung

---

## 📌 Important Notes

### Files COMPLETE (5 files)

-   Đã được gộp từ nhiều files nhỏ
-   Đầy đủ nhất, cập nhật nhất
-   **ƯU TIÊN ĐỌC NHỮNG FILE NÀY**

### Files Reference (9 files)

-   File nhỏ lẻ còn lại
-   Dùng để tham khảo nếu cần chi tiết
-   Một số nội dung đã được gộp vào COMPLETE files

### Files Private (1 file)

-   \`ELASTICSEARCH_PASSWORDS.txt\` - Chứa passwords
-   **KHÔNG ĐƯỢC COMMIT VÀO GIT**
-   Đã thêm vào \`.gitignore\`

---

## 🛠️ Maintain Documentation

### Cập nhật Documentation

Khi có thay đổi, cập nhật vào file COMPLETE tương ứng:

\`\`\`bash

# Elasticsearch changes

vim ELASTICSEARCH_COMPLETE.md

# Kafka changes

vim KAFKA_COMPLETE.md

# Kibana changes

vim KIBANA_COMPLETE.md

# Docker changes

vim DOCKER_COMPLETE.md

# Routes changes

vim LARAVEL_ROUTES.md
\`\`\`

### Tạo Documentation mới

Nếu có chủ đề mới:

1. Tạo file riêng trước (test)
2. Nếu > 3 files về cùng topic → Gộp thành COMPLETE file
3. Update INDEX.md này

---

## 📞 Support

Có câu hỏi? Tìm trong các file COMPLETE trước:

1. Check mục lục (TOC) trong file
2. Check section "Troubleshooting"
3. Search keywords (Ctrl+F)

Nếu không tìm thấy:

-   Hỏi team lead
-   Tạo issue trong project management tool

---

**Last Updated:** October 19, 2025  
**Maintainer:** Bui Manh Khuong  
**Status:** ✅ Documentation consolidation complete
