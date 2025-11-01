# 🗃️ DATABASE SCHEMA – PRODUCT DOMAIN (E-COMMERCE)

## 1. products

**Thông tin chính của sản phẩm**

| Cột         | Kiểu                     | Mô tả                |
| ----------- | ------------------------ | -------------------- |
| id          | BIGINT PK                | ID sản               |
| supplier_id | BIGINT FK → suppliers.id | Nhà cung cấp         |
| is_active   | BOOLEAN DEFAULT 1        | Trạng thái hoạt động |
| is_primary  | BOOLEAN DEFAULT 0        | Đánh dấu chính       |
| deleted_at  | DATETIME NULL            | Soft delete          |

## 2. categories (có rồi)

**Danh mục sản phẩm**

| Cột         | Kiểu                           | Mô tả          |
| ----------- | ------------------------------ | -------------- |
| id          | BIGINT PK                      |
| name        | VARCHAR(255)                   |
| slug        | VARCHAR(255) UNIQUE            |
| description | TEXT                           |
| parent_id   | BIGINT NULL FK → categories.id | Danh mục cha   |
| is_active   | BOOLEAN DEFAULT 1              |
| is_primary  | BOOLEAN DEFAULT 0              | Đánh dấu chính |
| created_at  | DATETIME                       |
| updated_at  | DATETIME                       |
| deleted_at  | DATETIME NULL                  | Soft delete    |

---

## 3. product_category (có rồi)

**Bảng trung gian nhiều-nhiều giữa sản phẩm và danh mục**

| Cột         | Kiểu                      | Mô tả                |
| ----------- | ------------------------- | -------------------- |
| product_id  | BIGINT FK → products.id   |
| category_id | BIGINT FK → categories.id |
| is_active   | BOOLEAN DEFAULT 1         | Trạng thái hoạt động |
| is_primary  | BOOLEAN DEFAULT 0         | Đánh dấu chính       |
| created_at  | DATETIME                  |
| updated_at  | DATETIME                  |
| deleted_at  | DATETIME NULL             | Soft delete          |
| PRIMARY KEY | (product_id, category_id) |

---

## 4. brands (có rồi)

**Thông tin thương hiệu**

| Cột         | Kiểu                | Mô tả                |
| ----------- | ------------------- | -------------------- |
| id          | BIGINT PK           |
| name        | VARCHAR(255)        |
| slug        | VARCHAR(255) UNIQUE |
| logo_url    | VARCHAR(255)        |
| description | TEXT                |
| website     | VARCHAR(255) NULL   |
| is_active   | BOOLEAN DEFAULT 1   | Trạng thái hoạt động |
| is_primary  | BOOLEAN DEFAULT 0   | Đánh dấu chính       |
| created_at  | DATETIME            |
| updated_at  | DATETIME            |
| deleted_at  | DATETIME NULL       | Soft delete          |

---

## 5. suppliers

**Thông tin nhà cung cấp**

| Cột          | Kiểu              | Mô tả                |
| ------------ | ----------------- | -------------------- |
| id           | BIGINT PK         |
| name         | VARCHAR(255)      |
| contact_name | VARCHAR(255)      |
| email        | VARCHAR(255)      |
| phone        | VARCHAR(50)       |
| address      | TEXT              |
| country      | VARCHAR(100)      |
| is_active    | BOOLEAN DEFAULT 1 | Trạng thái hoạt động |
| is_primary   | BOOLEAN DEFAULT 0 | Đánh dấu chính       |
| created_at   | DATETIME          |
| updated_at   | DATETIME          |
| deleted_at   | DATETIME NULL     | Soft delete          |

---

## 6. product_images (có rồi)

**Danh sách ảnh của sản phẩm**

| Cột        | Kiểu                    | Mô tả                |
| ---------- | ----------------------- | -------------------- |
| id         | BIGINT PK               |
| product_id | BIGINT FK → products.id |
| image_url  | VARCHAR(255)            |
| alt_text   | VARCHAR(255)            |
| is_main    | BOOLEAN DEFAULT 0       |
| sort_order | INT DEFAULT 0           |
| is_active  | BOOLEAN DEFAULT 1       | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0       | Đánh dấu chính       |
| created_at | DATETIME                |
| updated_at | DATETIME                |
| deleted_at | DATETIME NULL           | Soft delete          |

---

## 7. inventories

**Tồn kho sản phẩm theo kho hàng**

| Cột          | Kiểu                      | Mô tả                |
| ------------ | ------------------------- | -------------------- |
| id           | BIGINT PK                 |
| product_id   | BIGINT FK → products.id   |
| warehouse_id | BIGINT FK → warehouses.id |
| quantity     | INT                       |
| reserved     | INT DEFAULT 0             |
| is_active    | BOOLEAN DEFAULT 1         | Trạng thái hoạt động |
| is_primary   | BOOLEAN DEFAULT 0         | Đánh dấu chính       |
| created_at   | DATETIME                  |
| updated_at   | DATETIME                  |
| deleted_at   | DATETIME NULL             | Soft delete          |

---

## 8. warehouses

**Thông tin kho hàng**

| Cột           | Kiểu              | Mô tả                |
| ------------- | ----------------- | -------------------- |
| id            | BIGINT PK         |
| name          | VARCHAR(255)      |
| address       | TEXT              |
| region        | VARCHAR(100)      |
| contact_phone | VARCHAR(50)       |
| is_active     | BOOLEAN DEFAULT 1 | Trạng thái hoạt động |
| is_primary    | BOOLEAN DEFAULT 0 | Đánh dấu chính       |
| created_at    | DATETIME          |
| updated_at    | DATETIME          |
| deleted_at    | DATETIME NULL     | Soft delete          |

---

## 9. product_variants (có rồi)

**Biến thể (VD: size, màu)**

| Cột        | Kiểu                                         | Mô tả                |
| ---------- | -------------------------------------------- | -------------------- |
| id         | BIGINT PK                                    |
| product_id | BIGINT FK → products.id                      |
| sku        | VARCHAR(100) UNIQUE                          |
| name       | VARCHAR(255)                                 |
| price      | DECIMAL(15,2)                                |
| stock      | INT                                          |
| attributes | JSON (VD: `{ "color": "red", "size": "L" }`) |
| is_active  | BOOLEAN DEFAULT 1                            | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0                            | Đánh dấu chính       |
| created_at | DATETIME                                     |
| updated_at | DATETIME                                     |
| deleted_at | DATETIME NULL                                | Soft delete          |

---

## 10. attributes (có rồi)

**Định nghĩa thuộc tính sản phẩm**

| Cột        | Kiểu                                     | Mô tả                |
| ---------- | ---------------------------------------- | -------------------- |
| id         | BIGINT PK                                |
| name       | VARCHAR(255)                             |
| code       | VARCHAR(100) UNIQUE                      |
| type       | ENUM('text','number','boolean','select') |
| is_active  | BOOLEAN DEFAULT 1                        | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0                        | Đánh dấu chính       |
| created_at | DATETIME                                 |
| updated_at | DATETIME                                 |
| deleted_at | DATETIME NULL                            | Soft delete          |

---

## 11. attribute_values (có rồi)

**Các giá trị có thể có của thuộc tính**

| Cột          | Kiểu                      | Mô tả                |
| ------------ | ------------------------- | -------------------- |
| id           | BIGINT PK                 |
| attribute_id | BIGINT FK → attributes.id |
| value        | VARCHAR(255)              |
| display_name | VARCHAR(255)              |
| sort_order   | INT                       |
| is_active    | BOOLEAN DEFAULT 1         | Trạng thái hoạt động |
| is_primary   | BOOLEAN DEFAULT 0         | Đánh dấu chính       |
| created_at   | DATETIME                  |
| updated_at   | DATETIME                  |
| deleted_at   | DATETIME NULL             | Soft delete          |

---

## 12. product_attribute_values

**Liên kết sản phẩm với giá trị thuộc tính**

| Cột                | Kiểu                             | Mô tả                |
| ------------------ | -------------------------------- | -------------------- |
| product_id         | BIGINT FK → products.id          |
| attribute_value_id | BIGINT FK → attribute_values.id  |
| is_active          | BOOLEAN DEFAULT 1                | Trạng thái hoạt động |
| is_primary         | BOOLEAN DEFAULT 0                | Đánh dấu chính       |
| created_at         | DATETIME                         |
| updated_at         | DATETIME                         |
| deleted_at         | DATETIME NULL                    | Soft delete          |
| PRIMARY KEY        | (product_id, attribute_value_id) |

---

## 13. product_tags

**Thẻ gắn cho sản phẩm**

| Cột        | Kiểu                | Mô tả                |
| ---------- | ------------------- | -------------------- |
| id         | BIGINT PK           |
| name       | VARCHAR(100) UNIQUE |
| slug       | VARCHAR(100)        |
| is_active  | BOOLEAN DEFAULT 1   | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0   | Đánh dấu chính       |
| created_at | DATETIME            |
| updated_at | DATETIME            |
| deleted_at | DATETIME NULL       | Soft delete          |

---

## 14. product_tag_map

**Bảng trung gian giữa sản phẩm và thẻ**

| Cột         | Kiểu                 | Mô tả                |
| ----------- | -------------------- | -------------------- |
| product_id  | BIGINT FK            |
| tag_id      | BIGINT FK            |
| is_active   | BOOLEAN DEFAULT 1    | Trạng thái hoạt động |
| is_primary  | BOOLEAN DEFAULT 0    | Đánh dấu chính       |
| created_at  | DATETIME             |
| updated_at  | DATETIME             |
| deleted_at  | DATETIME NULL        | Soft delete          |
| PRIMARY KEY | (product_id, tag_id) |

---

## 15. product_reviews

**Đánh giá sản phẩm**

| Cột        | Kiểu                                  | Mô tả                |
| ---------- | ------------------------------------- | -------------------- |
| id         | BIGINT PK                             |
| product_id | BIGINT FK                             |
| user_id    | BIGINT FK → users.id                  |
| rating     | TINYINT (1–5)                         |
| comment    | TEXT                                  |
| status     | ENUM('pending','approved','rejected') |
| is_active  | BOOLEAN DEFAULT 1                     | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0                     | Đánh dấu chính       |
| created_at | DATETIME                              |
| updated_at | DATETIME                              |
| deleted_at | DATETIME NULL                         | Soft delete          |

---

## 16. product_questions

**Câu hỏi khách hàng**

| Cột        | Kiểu              | Mô tả                |
| ---------- | ----------------- | -------------------- |
| id         | BIGINT PK         |
| product_id | BIGINT FK         |
| user_id    | BIGINT FK         |
| question   | TEXT              |
| answer     | TEXT NULL         |
| is_active  | BOOLEAN DEFAULT 1 | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0 | Đánh dấu chính       |
| created_at | DATETIME          |
| updated_at | DATETIME          |
| deleted_at | DATETIME NULL     | Soft delete          |

---

## 17. discounts

**Khuyến mãi chung**

| Cột        | Kiểu                    | Mô tả          |
| ---------- | ----------------------- | -------------- |
| id         | BIGINT PK               |
| name       | VARCHAR(255)            |
| type       | ENUM('percent','fixed') |
| value      | DECIMAL(10,2)           |
| start_date | DATETIME                |
| end_date   | DATETIME                |
| is_active  | BOOLEAN                 |
| is_primary | BOOLEAN DEFAULT 0       | Đánh dấu chính |
| created_at | DATETIME                |
| updated_at | DATETIME                |
| deleted_at | DATETIME NULL           | Soft delete    |

---

## 18. product_discounts

**Khuyến mãi áp dụng riêng cho sản phẩm**

| Cột         | Kiểu                      | Mô tả                |
| ----------- | ------------------------- | -------------------- |
| product_id  | BIGINT FK                 |
| discount_id | BIGINT FK                 |
| is_active   | BOOLEAN DEFAULT 1         | Trạng thái hoạt động |
| is_primary  | BOOLEAN DEFAULT 0         | Đánh dấu chính       |
| created_at  | DATETIME                  |
| updated_at  | DATETIME                  |
| deleted_at  | DATETIME NULL             | Soft delete          |
| PRIMARY KEY | (product_id, discount_id) |

---

## 19. price_histories

**Lịch sử thay đổi giá**

| Cột        | Kiểu                 | Mô tả                |
| ---------- | -------------------- | -------------------- |
| id         | BIGINT PK            |
| product_id | BIGINT FK            |
| old_price  | DECIMAL(15,2)        |
| new_price  | DECIMAL(15,2)        |
| changed_at | DATETIME             |
| changed_by | BIGINT FK → users.id |
| is_active  | BOOLEAN DEFAULT 1    | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0    | Đánh dấu chính       |
| created_at | DATETIME             |
| updated_at | DATETIME             |
| deleted_at | DATETIME NULL        | Soft delete          |

---

## 20. product_audits

**Ghi log hành vi thay đổi sản phẩm**

| Cột        | Kiểu              | Mô tả                |
| ---------- | ----------------- | -------------------- |
| id         | BIGINT PK         |
| product_id | BIGINT            |
| action     | VARCHAR(100)      |
| user_id    | BIGINT            |
| payload    | JSON              |
| is_active  | BOOLEAN DEFAULT 1 | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0 | Đánh dấu chính       |
| created_at | DATETIME          |
| updated_at | DATETIME          |
| deleted_at | DATETIME NULL     | Soft delete          |

---

## 21. product_recommendations

**Gợi ý sản phẩm liên quan**

| Cột                | Kiểu                             | Mô tả                |
| ------------------ | -------------------------------- | -------------------- |
| product_id         | BIGINT FK                        |
| related_product_id | BIGINT FK                        |
| score              | DECIMAL(5,2)                     |
| is_active          | BOOLEAN DEFAULT 1                | Trạng thái hoạt động |
| is_primary         | BOOLEAN DEFAULT 0                | Đánh dấu chính       |
| created_at         | DATETIME                         |
| updated_at         | DATETIME                         |
| deleted_at         | DATETIME NULL                    | Soft delete          |
| PRIMARY KEY        | (product_id, related_product_id) |

---

## 22. product_collections

**Tập hợp sản phẩm (VD: “Sản phẩm nổi bật”)**

| Cột         | Kiểu         | Mô tả |
| ----------- | ------------ | ----- |
| id          | BIGINT PK    |
| name        | VARCHAR(255) |
| slug        | VARCHAR(255) |
| description | TEXT         |
| created_at  | DATETIME     |

---

## 23. collection_products

**Liên kết giữa collection và product**

| Cột           | Kiểu                        | Mô tả                |
| ------------- | --------------------------- | -------------------- |
| collection_id | BIGINT FK                   |
| product_id    | BIGINT FK                   |
| sort_order    | INT                         |
| is_active     | BOOLEAN DEFAULT 1           | Trạng thái hoạt động |
| is_primary    | BOOLEAN DEFAULT 0           | Đánh dấu chính       |
| created_at    | DATETIME                    |
| updated_at    | DATETIME                    |
| deleted_at    | DATETIME NULL               | Soft delete          |
| PRIMARY KEY   | (collection_id, product_id) |

---

## 24. product_seo

**Dữ liệu SEO riêng cho sản phẩm**

| Cột              | Kiểu              | Mô tả                |
| ---------------- | ----------------- | -------------------- |
| product_id       | BIGINT PK         |
| meta_title       | VARCHAR(255)      |
| meta_description | TEXT              |
| meta_keywords    | TEXT              |
| is_active        | BOOLEAN DEFAULT 1 | Trạng thái hoạt động |
| is_primary       | BOOLEAN DEFAULT 0 | Đánh dấu chính       |
| created_at       | DATETIME          |
| updated_at       | DATETIME          |
| deleted_at       | DATETIME NULL     | Soft delete          |

---

## 25. product_logs

**Ghi log hệ thống (Kafka / Audit / Cache)**

| Cột        | Kiểu                                 | Mô tả                |
| ---------- | ------------------------------------ | -------------------- |
| id         | BIGINT PK                            |
| product_id | BIGINT                               |
| type       | ENUM('kafka','cache','sync','error') |
| message    | LongTEXT                             |
| is_active  | BOOLEAN DEFAULT 1                    | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0                    | Đánh dấu chính       |
| created_at | DATETIME                             |
| updated_at | DATETIME                             |
| deleted_at | DATETIME NULL                        | Soft delete          |

---

## 26. product_sync_queue

**Hàng đợi đồng bộ dữ liệu**

| Cột        | Kiểu                                         | Mô tả                |
| ---------- | -------------------------------------------- | -------------------- |
| id         | BIGINT PK                                    |
| product_id | BIGINT                                       |
| target     | ENUM('elasticsearch','redis','external_api') |
| status     | ENUM('pending','processing','done','failed') |
| payload    | JSON                                         |
| is_active  | BOOLEAN DEFAULT 1                            | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0                            | Đánh dấu chính       |
| created_at | DATETIME                                     |
| updated_at | DATETIME                                     |
| deleted_at | DATETIME NULL                                | Soft delete          |

---

## 27. product_imports

**Theo dõi quá trình import sản phẩm**

| Cột          | Kiểu                                      | Mô tả                |
| ------------ | ----------------------------------------- | -------------------- |
| id           | BIGINT PK                                 |
| source_file  | VARCHAR(255)                              |
| total_rows   | INT                                       |
| success_rows | INT                                       |
| failed_rows  | INT                                       |
| status       | ENUM('pending','running','done','failed') |
| created_by   | BIGINT                                    |
| is_active    | BOOLEAN DEFAULT 1                         | Trạng thái hoạt động |
| is_primary   | BOOLEAN DEFAULT 0                         | Đánh dấu chính       |
| created_at   | DATETIME                                  |
| updated_at   | DATETIME                                  |
| deleted_at   | DATETIME NULL                             | Soft delete          |

---

## 28. product_export_jobs

**Theo dõi xuất dữ liệu**

| Cột        | Kiểu                                      | Mô tả                |
| ---------- | ----------------------------------------- | -------------------- |
| id         | BIGINT PK                                 |
| format     | ENUM('csv','json','xml')                  |
| file_path  | VARCHAR(255)                              |
| status     | ENUM('pending','running','done','failed') |
| created_by | BIGINT                                    |
| is_active  | BOOLEAN DEFAULT 1                         | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0                         | Đánh dấu chính       |
| created_at | DATETIME                                  |
| updated_at | DATETIME                                  |
| deleted_at | DATETIME NULL                             | Soft delete          |

---

## 29. product_views

**Thống kê lượt xem sản phẩm**

| Cột        | Kiểu              | Mô tả                |
| ---------- | ----------------- | -------------------- |
| id         | BIGINT PK         |
| product_id | BIGINT            |
| user_id    | BIGINT NULL       |
| ip_address | VARCHAR(45)       |
| viewed_at  | DATETIME          |
| is_active  | BOOLEAN DEFAULT 1 | Trạng thái hoạt động |
| is_primary | BOOLEAN DEFAULT 0 | Đánh dấu chính       |
| created_at | DATETIME          |
| updated_at | DATETIME          |
| deleted_at | DATETIME NULL     | Soft delete          |

---

## 30. product_favorites

**Danh sách sản phẩm yêu thích**

| Cột         | Kiểu                  | Mô tả                |
| ----------- | --------------------- | -------------------- |
| user_id     | BIGINT                |
| product_id  | BIGINT                |
| created_at  | DATETIME              |
| is_active   | BOOLEAN DEFAULT 1     | Trạng thái hoạt động |
| is_primary  | BOOLEAN DEFAULT 0     | Đánh dấu chính       |
| updated_at  | DATETIME              |
| deleted_at  | DATETIME NULL         | Soft delete          |
| PRIMARY KEY | (user_id, product_id) |

---

## 🔗 Tổng quan quan hệ

| Quan hệ                | Loại         | Mô tả                    |
| ---------------------- | ------------ | ------------------------ |
| products ↔ categories  | Many-to-many | product_category         |
| products ↔ brands      | One-to-many  | brand_id                 |
| products ↔ suppliers   | One-to-many  | supplier_id              |
| products ↔ attributes  | Many-to-many | product_attribute_values |
| products ↔ tags        | Many-to-many | product_tag_map          |
| products ↔ discounts   | Many-to-many | product_discounts        |
| products ↔ reviews     | One-to-many  | product_reviews          |
| products ↔ variants    | One-to-many  | product_variants         |
| products ↔ collections | Many-to-many | collection_products      |
| products ↔ inventories | One-to-many  | inventories              |
| products ↔ logs        | One-to-many  | product_logs             |
