# 📘 LARAVEL ROUTES - HƯỚNG DẪN ĐẦY ĐỦ

## 📋 MỤC LỤC

1. [Thông Tin Cơ Bản](#thông-tin-cơ-bản)
2. [Route Organization - DDD Structure](#route-organization---ddd-structure)
3. [Product Routes (4 Files)](#product-routes-4-files)
4. [Category Routes](#category-routes)
5. [Brand Routes](#brand-routes)
6. [Tại sao Product có nhiều Route Files](#tại-sao-product-có-nhiều-route-files)
7. [Route Loading Strategy](#route-loading-strategy)
8. [Best Practices](#best-practices)
9. [Testing Routes](#testing-routes)

---

## 📌 THÔNG TIN CƠ BẢN

### Cấu trúc Routes trong Project

```
routes/
├── api.php                             # Main API routes loader
├── web.php                             # Web routes
├── console.php                         # Console commands
└── Api/                                # Shared/legacy routes
    └── stock.php

app/Domain/
├── Product/
│   └── Routes/                         # Product domain routes (4 files)
│       ├── api.php                     # Product CRUD
│       ├── search.php                  # Elasticsearch search
│       ├── variant.php                 # Product variants
│       └── variant_albums.php          # Variant image albums
├── Category/
│   └── routes/                         # Category domain routes
│       └── api.php
└── Brand/
    └── routes/                         # Brand domain routes
        └── api.php
```

### Route Pattern Convention

**❌ CŨ (conflict với /search):**

```
GET  /api/v1/products/{slug}
PUT  /api/v1/products/{slug}
DELETE /api/v1/products/{slug}
```

**✅ MỚI (sử dụng prefix /detail/):**

```
GET  /api/v1/products/detail/{slug}
PUT  /api/v1/products/detail/{slug}
DELETE /api/v1/products/detail/{slug}
```

**Ví dụ:**

-   Product: `GET /api/v1/products/detail/iphone-15`
-   Category: `GET /api/v1/categories/detail/electronics`
-   Brand: `GET /api/v1/brands/detail/apple`

---

## 📂 ROUTE ORGANIZATION - DDD STRUCTURE

### Tổ chức Routes theo Domain

Routes được tổ chức theo Domain-Driven Design (DDD), mỗi domain quản lý routes của riêng mình:

```
app/Domain/
├── Product/
│   ├── Routes/                         # ← Tất cả routes của Product
│   ├── Http/Controllers/
│   ├── Services/
│   └── ...
├── Category/
│   ├── Routes/                         # ← Tất cả routes của Category
│   ├── Http/Controllers/
│   └── ...
└── Brand/
    ├── Routes/                         # ← Tất cả routes của Brand
    ├── Http/Controllers/
    └── ...
```

### Lợi ích của cấu trúc DDD

1. **Không conflict routes**: `/search` và `/detail/{slug}` không xung đột
2. **DDD compliant**: Routes nằm trong domain tương ứng
3. **Dễ quản lý**: Mỗi domain tự quản lý routes của mình
4. **Scalable**: Thêm domain mới chỉ cần thêm vào array `$domains`
5. **Clear separation**: Search routes tách riêng khỏi CRUD routes

---

## 🔍 PRODUCT ROUTES (4 FILES)

Product domain có **4 route files** để tổ chức rõ ràng các chức năng:

### Tổng quan

```
app/Domain/Product/Routes/
├── api.php                 # Product CRUD (6 endpoints)
├── search.php              # Elasticsearch search (4 endpoints)
├── variant.php             # Product variants (5 endpoints)
└── variant_albums.php      # Variant image albums (5 endpoints)

TỔNG: 20 endpoints liên quan đến Product
```

### 1. File: `api.php` - Product CRUD

**Mục đích:** Quản lý sản phẩm cơ bản (Core CRUD)

**File:** `app/Domain/Product/Routes/api.php`

```php
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('clear-cache', [ProductController::class, 'clearCacheAllPageProduct']);

    // CRUD routes with /detail/ prefix
    Route::get('detail/{slug}', [ProductController::class, 'show']);
    Route::put('detail/{slug}', [ProductController::class, 'update']);
    Route::delete('detail/{slug}', [ProductController::class, 'destroy']);
});
```

**Available endpoints:**

```
GET    /api/v1/products                  - List products (pagination)
POST   /api/v1/products                  - Create product
GET    /api/v1/products/detail/{slug}    - Get product by slug
PUT    /api/v1/products/detail/{slug}    - Update product by slug
DELETE /api/v1/products/detail/{slug}    - Delete product by slug
GET    /api/v1/products/clear-cache      - Clear product cache
```

**Tại sao tách riêng?**

-   Đây là chức năng cốt lõi nhất
-   Không muốn mix với search logic phức tạp
-   Dễ maintain và test

### 2. File: `search.php` - Elasticsearch Search

**Mục đích:** Tìm kiếm sản phẩm với Elasticsearch

**File:** `app/Domain/Product/Routes/search.php`

```php
Route::group(['prefix' => 'products'], function () {
    Route::get('search/health', [ProductSearchController::class, 'health']);
    Route::get('search', [ProductSearchController::class, 'search']);
    Route::get('search/config', [ProductSearchController::class, 'searchByConfig']);
    Route::get('{id}/search', [ProductSearchController::class, 'show']);
});
```

**Available endpoints:**

```
GET /api/v1/products/search?q=iphone           - Text search (multi-field)
GET /api/v1/products/search/config?color=red   - Filter by variant config
GET /api/v1/products/search/health             - Elasticsearch health check
GET /api/v1/products/{id}/search               - Get product from ES by ID
```

**Search parameters:**

-   `q` - Text query (name, brand_name, category_name, slug)
-   `brand_id`, `brand_name` - Filter by brand
-   `category_id`, `category_name` - Filter by category
-   `price_min`, `price_max` - Filter by price range
-   `color`, `variant_size`, `storage` - Filter by variant config
-   `is_active` - Filter by status
-   `size`, `page` - Pagination

**Tại sao tách riêng?**

-   Logic search phức tạp (nested queries, filters, aggregations)
-   Khác biệt hoàn toàn với database CRUD
-   Có thể có team riêng maintain search features
-   Dễ disable/enable search feature

### 3. File: `variant.php` - Product Variants

**Mục đích:** Quản lý biến thể sản phẩm (màu, size, giá khác nhau)

**File:** `app/Domain/Product/Routes/variant.php`

```php
Route::apiResource('product_variants', ProductVariantController::class);
```

**Available endpoints:**

```
GET    /api/v1/product_variants           - List all variants
POST   /api/v1/product_variants           - Create variant
GET    /api/v1/product_variants/{id}      - Get variant by ID
PUT    /api/v1/product_variants/{id}      - Update variant
DELETE /api/v1/product_variants/{id}      - Delete variant
```

**Ví dụ Variant:**

```
Product: iPhone 15
├── Variant 1: Red, 128GB, $999
├── Variant 2: Blue, 256GB, $1099
└── Variant 3: Black, 512GB, $1299
```

**Tại sao tách riêng?**

-   Variant là sub-resource của Product
-   Có logic riêng (config validation, price calculation)
-   Product có thể không có variants (simple product)
-   Có thể có team riêng maintain variant logic

### 4. File: `variant_albums.php` - Variant Image Albums

**Mục đích:** Quản lý hình ảnh của từng biến thể

**File:** `app/Domain/Product/Routes/variant_albums.php`

```php
Route::apiResource('product_variant_albums', ProductVariantAlbumsController::class);
```

**Available endpoints:**

```
GET    /api/v1/product_variant_albums           - List all albums
POST   /api/v1/product_variant_albums           - Create album (upload images)
GET    /api/v1/product_variant_albums/{id}      - Get album by ID
PUT    /api/v1/product_variant_albums/{id}      - Update album
DELETE /api/v1/product_variant_albums/{id}      - Delete album
```

**Ví dụ Album:**

```
iPhone 15 - Red Variant
├── Album 1: Front view (3 images)
├── Album 2: Back view (2 images)
└── Album 3: Side view (2 images)
```

**Tại sao tách riêng?**

-   Variant albums là sub-resource của Variant
-   Liên quan đến file upload/storage
-   Có thể integrate với CDN/Cloudinary
-   Logic khác hoàn toàn với product CRUD

---

## 📂 CATEGORY ROUTES

### File: `app/Domain/Category/routes/api.php`

```php
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('detail/{slug}', [CategoryController::class, 'show']);
    Route::put('detail/{slug}', [CategoryController::class, 'update']);
    Route::delete('detail/{slug}', [CategoryController::class, 'destroy']);
});
```

**Available endpoints:**

```
GET    /api/v1/categories                  - List all categories
POST   /api/v1/categories                  - Create category
GET    /api/v1/categories/detail/{slug}    - Get category by slug
PUT    /api/v1/categories/detail/{slug}    - Update category by slug
DELETE /api/v1/categories/detail/{slug}    - Delete category by slug
```

**Tại sao Category chỉ có 1 file?**

-   Category là domain đơn giản (chỉ CRUD)
-   Không có search phức tạp
-   Không có sub-resources như Product

---

## 🏷️ BRAND ROUTES

### File: `app/Domain/Brand/routes/api.php`

```php
Route::prefix('brands')->group(function () {
    Route::get('/', [BrandController::class, 'index']);
    Route::post('/', [BrandController::class, 'store']);
    Route::get('detail/{slug}', [BrandController::class, 'show']);
    Route::put('detail/{slug}', [BrandController::class, 'update']);
    Route::delete('detail/{slug}', [BrandController::class, 'destroy']);
});
```

**Available endpoints:**

```
GET    /api/v1/brands                  - List all brands
POST   /api/v1/brands                  - Create brand
GET    /api/v1/brands/detail/{slug}    - Get brand by slug
PUT    /api/v1/brands/detail/{slug}    - Update brand by slug
DELETE /api/v1/brands/detail/{slug}    - Delete brand by slug
```

**Tại sao Brand chỉ có 1 file?**

-   Brand là domain đơn giản (chỉ CRUD)
-   Không có search phức tạp
-   Không có sub-resources như Product

---

## 🎯 TẠI SAO PRODUCT CÓ NHIỀU ROUTE FILES

### So sánh Domain Complexity

| Domain       | Route Files | Endpoints | Lý do                                              |
| ------------ | ----------- | --------- | -------------------------------------------------- |
| **Product**  | 4 files     | 20        | Domain phức tạp: CRUD + Search + Variants + Albums |
| **Category** | 1 file      | 5         | Simple CRUD only                                   |
| **Brand**    | 1 file      | 5         | Simple CRUD only                                   |

### Lợi ích của việc tách files

#### ✅ 1. Separation of Concerns

Mỗi file phục vụ 1 chức năng cụ thể:

-   CRUD ≠ Search ≠ Variants ≠ Albums

#### ✅ 2. Dễ Maintain

-   Sửa search không ảnh hưởng CRUD
-   Thêm variant feature không touch product core
-   Bug trong albums không affect search

#### ✅ 3. Team Collaboration

-   Team A: Product CRUD (api.php)
-   Team B: Search features (search.php)
-   Team C: Variant management (variant.php, variant_albums.php)

#### ✅ 4. Performance Optimization

-   Có thể cache/optimize từng loại route riêng
-   Disable search feature nếu ES down
-   Rate limit khác nhau cho từng loại endpoint

#### ✅ 5. Testing

-   Test CRUD riêng không cần mock ES
-   Test search không cần mock database
-   Unit test dễ hơn với concerns tách biệt

### So sánh: 1 file vs Multiple files

#### ❌ Nếu gộp tất cả vào 1 file:

```php
// routes/product.php (500+ lines)

Route::prefix('products')->group(function () {
    // CRUD routes (50 lines)
    // ...

    // Search routes (100 lines)
    // ...

    // Variant routes (150 lines)
    // ...

    // Variant albums routes (200 lines)
    // ...
});
```

**Vấn đề:**

-   File quá dài, khó đọc
-   Khó tìm route cần sửa
-   Git conflict khi nhiều người sửa
-   Không rõ ràng về responsibility

#### ✅ Tách thành 4 files:

```php
// api.php (50 lines) - Clear CRUD responsibility
// search.php (100 lines) - Clear search responsibility
// variant.php (80 lines) - Clear variant responsibility
// variant_albums.php (100 lines) - Clear albums responsibility
```

**Lợi ích:**

-   File ngắn, dễ đọc
-   Tìm route nhanh (biết cần sửa file nào)
-   Ít conflict khi merge code
-   Rõ ràng về responsibility

---

## 🔄 ROUTE LOADING STRATEGY

### File: `routes/api.php`

```php
Route::prefix('v1')->group(function () {
    // Load routes from /routes/Api (legacy or shared routes)
    $routePath = __DIR__ . '/Api';
    if (File::exists($routePath)) {
        foreach (File::allFiles($routePath) as $file) {
            require $file->getPathname();
        }
    }

    // Load routes from Domain folders
    $domainPath = app_path('Domain');
    $domains = ['Product', 'Category', 'Brand'];

    foreach ($domains as $domain) {
        $domainRoutePath = "{$domainPath}/{$domain}/routes";
        if (File::exists($domainRoutePath)) {
            foreach (File::allFiles($domainRoutePath) as $file) {
                require $file->getPathname();
            }
        }
    }
});
```

### Cách hoạt động

1. **Load shared routes** từ `/routes/Api/` (legacy hoặc shared)
2. **Loop qua domains** trong array `$domains`
3. **Load tất cả route files** trong mỗi domain's `routes/` folder
4. **All routes** đều có prefix `/api/v1/`

### Thêm Domain mới

Để thêm domain mới, chỉ cần thêm vào array:

```php
$domains = ['Product', 'Category', 'Brand', 'Order', 'User'];
```

Hoặc tự động scan:

```php
$domains = array_filter(
    scandir(app_path('Domain')),
    fn($dir) => is_dir(app_path("Domain/{$dir}")) && $dir !== '.' && $dir !== '..'
);
```

---

## 📚 BEST PRACTICES

### Khi nào nên tách route file?

#### ✅ NÊN tách khi:

1. Domain có > 10 endpoints
2. Có nhiều loại chức năng khác nhau (CRUD + Search + ...)
3. Có sub-resources (Product → Variant → Albums)
4. Team muốn làm việc song song
5. Có logic phức tạp cần tách biệt

#### ❌ KHÔNG cần tách khi:

1. Domain đơn giản (< 10 endpoints)
2. Chỉ có CRUD cơ bản
3. Không có sub-resources
4. Team nhỏ, 1-2 người

### File Naming Convention

**✅ GOOD:**

```
api.php          # Main CRUD
search.php       # Search functionality
variant.php      # Variant management
variant_albums.php  # Albums management
```

**❌ BAD:**

```
routes1.php
product_routes.php
all_routes.php
```

### File Size Guideline

-   Mỗi file nên **< 200 lines**
-   Nếu > 200 lines, cân nhắc tách thêm
-   Nếu < 50 lines và liên quan, cân nhắc gộp lại

### Comments

Mỗi file nên có comment giải thích purpose:

```php
/*
|--------------------------------------------------------------------------
| Product Search API Routes
|--------------------------------------------------------------------------
| Elasticsearch-powered product search routes with multiple filters.
| Handles text search, price range, brand/category filtering, etc.
*/

Route::group(['prefix' => 'products'], function () {
    // ...
});
```

### Prefix Consistency

Tất cả routes trong domain dùng cùng prefix:

```php
Route::prefix('products')->group(function () {
    // All routes use /products prefix
});
```

---

## 🧪 TESTING ROUTES

### List All Routes

```bash
# List all routes
docker exec laravel_php php artisan route:list

# Filter by path
docker exec laravel_php php artisan route:list --path=products

# Filter by method
docker exec laravel_php php artisan route:list --method=GET

# Show only specific columns
docker exec laravel_php php artisan route:list --columns=method,uri,name
```

### Test Product Routes

```bash
# Test product search (không conflict với detail/{slug})
curl "http://localhost/api/v1/products/search?q=iphone"

# Test product detail (prefix /detail/)
curl "http://localhost/api/v1/products/detail/iphone-15"

# Test product list
curl "http://localhost/api/v1/products?page=1&size=10"

# Test product create
curl -X POST "http://localhost/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{"product": {...}, "product_variant": {...}}'

# Test variant list
curl "http://localhost/api/v1/product_variants"

# Test variant albums
curl "http://localhost/api/v1/product_variant_albums"
```

### Test Category Routes

```bash
# Test category detail
curl "http://localhost/api/v1/categories/detail/electronics"

# Test category list
curl "http://localhost/api/v1/categories"
```

### Test Brand Routes

```bash
# Test brand detail
curl "http://localhost/api/v1/brands/detail/apple"

# Test brand list
curl "http://localhost/api/v1/brands"
```

### Clear Route Cache

```bash
# Clear route cache
docker exec laravel_php php artisan route:clear

# Cache routes (production)
docker exec laravel_php php artisan route:cache
```

---

## 🆕 TẠO DOMAIN MỚI VỚI ROUTES

### Command: `make:domain`

Command đã được update để tự động tạo routes trong domain:

```bash
docker exec laravel_php php artisan make:domain Order
```

Sẽ tạo:

```
app/Domain/Order/
├── routes/
│   └── api.php              # ← Routes tự động tạo
├── Http/Controllers/
│   └── OrderController.php
├── Services/
│   └── OrderService.php
├── Repositories/
│   └── OrderRepository.php
└── Models/
    └── Order.php
```

### Generated Route File

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Order\Http\Controllers\OrderController;

/*
|--------------------------------------------------------------------------
| Order API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('detail/{slug}', [OrderController::class, 'show']);
    Route::put('detail/{slug}', [OrderController::class, 'update']);
    Route::delete('detail/{slug}', [OrderController::class, 'destroy']);
});
```

### Register Domain

Thêm vào `routes/api.php`:

```php
$domains = ['Product', 'Category', 'Brand', 'Order'];
```

---

## 📋 TỔNG KẾT ROUTES

### Product Domain Routes Summary

| File                 | Purpose  | Endpoints | Example                         |
| -------------------- | -------- | --------- | ------------------------------- |
| `api.php`            | CRUD     | 6         | `GET /products/detail/{slug}`   |
| `search.php`         | Search   | 4         | `GET /products/search?q=iphone` |
| `variant.php`        | Variants | 5         | `GET /product_variants/{id}`    |
| `variant_albums.php` | Albums   | 5         | `POST /product_variant_albums`  |
| **TOTAL**            | -        | **20**    | -                               |

### All Domains Summary

| Domain    | Files | Endpoints | Complexity |
| --------- | ----- | --------- | ---------- |
| Product   | 4     | 20        | High       |
| Category  | 1     | 5         | Low        |
| Brand     | 1     | 5         | Low        |
| **TOTAL** | **6** | **30**    | -          |

---

## ✅ CHECKLIST

-   [x] Routes tổ chức theo DDD structure
-   [x] Mỗi domain quản lý routes của mình
-   [x] Product có 4 route files (CRUD, Search, Variants, Albums)
-   [x] Category và Brand có 1 route file (simple CRUD)
-   [x] Prefix `/detail/` cho CRUD routes tránh conflict
-   [x] Route loading strategy trong `routes/api.php`
-   [x] Command `make:domain` tạo routes tự động
-   [x] Clear separation of concerns
-   [x] Documentation đầy đủ

---

## 🔗 LIÊN QUAN

-   **Docker:** Xem [DOCKER_COMPLETE.md](./DOCKER_COMPLETE.md) để chạy Laravel commands
-   **Elasticsearch:** Xem [ELASTICSEARCH_COMPLETE.md](./ELASTICSEARCH_COMPLETE.md) để hiểu search routes
-   **Kafka:** Xem [KAFKA_COMPLETE.md](./KAFKA_COMPLETE.md) để hiểu event flow

---

**📅 Last Updated:** October 19, 2025  
**✅ Status:** Complete & Production Ready
