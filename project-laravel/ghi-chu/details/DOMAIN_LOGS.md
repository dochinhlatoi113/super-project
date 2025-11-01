# Domain Logging Structure

## ✅ Đã sửa 2 lỗi:

### Lỗi 1: "Call to a member function items() on array"

**Nguyên nhân**: Khi Redis cache trả về data, nó là array (từ `json_decode`), không phải Laravel Paginator instance.

**Giải pháp**: Cập nhật `BaseApiResponse::paginatedResponse()` để xử lý cả array và Paginator.

```php
// Trước (lỗi):
protected function paginatedResponse($paginatedData, string $message = 'Success'): JsonResponse
{
    return $this->successResponse([
        'items' => $paginatedData->items(), // Lỗi nếu $paginatedData là array
        'pagination' => [...]
    ], $message);
}

// Sau (đã fix):
protected function paginatedResponse($paginatedData, string $message = 'Success'): JsonResponse
{
    // Nếu là array (từ cache), trả về trực tiếp
    if (is_array($paginatedData)) {
        return $this->successResponse($paginatedData, $message);
    }

    // Nếu là Paginator instance
    return $this->successResponse([
        'items' => $paginatedData->items(),
        'pagination' => [...]
    ], $message);
}
```

### Lỗi 2: Log không hiển thị đầy đủ thông tin

**Giải pháp**:

-   Thêm `file`, `line`, `trace` vào log
-   Ghi log vào thư mục riêng của từng Domain
-   Hiển thị full error khi `APP_DEBUG=true`

---

## 📁 Cấu trúc Log theo Domain

### Product Domain

**Log File**: `/src/app/Domain/Product/storage/logs/product.log`

**Log Channel**: `product`

**Controller**: `ProductController`

-   `index()` - Failed to retrieve products in ProductController::index()
-   `store()` - Failed to create product in ProductController::store()
-   `update()` - Failed to update product in ProductController::update()
-   `destroy()` - Failed to delete product in ProductController::destroy()
-   `clearCacheAllPageProduct()` - Failed to clear product cache

---

### Category Domain

**Log File**: `/src/app/Domain/Category/storage/logs/category.log`

**Log Channel**: `category`

**Controller**: `CategoryController`

-   `index()` - Failed to retrieve categories in CategoryController::index()
-   `store()` - Failed to create category in CategoryController::store()
-   `update()` - Failed to update category in CategoryController::update()
-   `destroy()` - Failed to delete category in CategoryController::destroy()

---

### Brand Domain

**Log File**: `/src/app/Domain/Brand/storage/logs/brand.log`

**Log Channel**: `brand`

**Controller**: `BrandController`

-   `index()` - Failed to retrieve brands in BrandController::index()
-   `store()` - Failed to create brand in BrandController::store()
-   `update()` - Failed to update brand in BrandController::update()
-   `destroy()` - Failed to delete brand in BrandController::destroy()

---

## 📝 Format Log

Mỗi log entry bao gồm:

```php
Log::channel('product')->error('Failed to retrieve products in ProductController::index()', [
    'error' => $e->getMessage(),
    'file' => $e->getFile(),
    'line' => $e->getLine(),
    'trace' => $e->getTraceAsString()
]);
```

---

## 🔍 Xem Log

### Xem log của Product:

```bash
# Xem 50 dòng cuối
docker exec laravel_php tail -n 50 /var/www/html/app/Domain/Product/storage/logs/product.log

# Theo dõi real-time
docker exec laravel_php tail -f /var/www/html/app/Domain/Product/storage/logs/product.log
```

### Xem log của Category:

```bash
docker exec laravel_php tail -n 50 /var/www/html/app/Domain/Category/storage/logs/category.log
```

### Xem log của Brand:

```bash
docker exec laravel_php tail -n 50 /var/www/html/app/Domain/Brand/storage/logs/brand.log
```

---

## 🎯 Response Format khi có lỗi

### Khi APP_DEBUG=true (Development):

```json
{
    "status": "error",
    "httpCode": 500,
    "message": "Failed to retrieve products",
    "errors": {
        "message": "Call to a member function items() on array",
        "file": "/var/www/html/app/Domain/Product/Http/Controllers/ProductController.php",
        "line": 45
    }
}
```

### Khi APP_DEBUG=false (Production):

```json
{
    "status": "error",
    "httpCode": 500,
    "message": "Failed to retrieve products",
    "errors": null
}
```

---

## 📌 Log Channels đã cấu hình trong `config/logging.php`:

1. `product` - Product domain logs
2. `category` - Category domain logs
3. `brand` - Brand domain logs
4. `elasticsearch` - Elasticsearch operations
5. `kafka` - Kafka operations
6. `redis` - Redis operations

---

## ✅ Completed

-   [x] Fixed `paginatedResponse()` to handle both array and Paginator
-   [x] Created log directories for Product, Category, Brand
-   [x] Added log channels in `config/logging.php`
-   [x] Updated ProductController to log to Product domain
-   [x] Updated CategoryController to log to Category domain
-   [x] Updated BrandController to log to Brand domain
-   [x] Added full error details (message, file, line, trace)
-   [x] Configured debug mode to show/hide error details
