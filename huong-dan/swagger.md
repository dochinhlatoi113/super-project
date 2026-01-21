# Hướng dẫn sử dụng Swagger trong Laravel

## 1. Cài đặt Swagger (l5-swagger)

### 1.1 Cài đặt package
```bash
composer require darkaonline/l5-swagger
```

### 1.2 Publish cấu hình và assets
```bash
php artisan vendor:publish --provider="DarkaOnLine\L5Swagger\L5SwaggerServiceProvider"
```

### 1.3 Đăng ký Service Provider (nếu Laravel < 5.5)
Thêm vào `config/app.php` trong mảng `providers`:
```php
DarkaOnLine\L5Swagger\L5SwaggerServiceProvider::class,
```

## 2. Cấu hình Swagger

### 2.1 File cấu hình chính: `config/l5-swagger.php`
```php
return [
    'default' => 'default',
    'documentations' => [
        'default' => [
            'api' => [
                'title' => 'L5 Swagger UI',
            ],
            'routes' => [
                'api' => 'api/documentation', // URL truy cập Swagger UI
            ],
            'paths' => [
                'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),
                'swagger_ui_assets_path' => env('L5_SWAGGER_UI_ASSETS_PATH', 'vendor/swagger-api/swagger-ui/dist/'),
                'docs_json' => 'api-docs.json',
                'docs_yaml' => 'api-docs.yaml',
                'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),
                'annotations' => [
                    base_path('app/Domain'),        // Scan thư mục Domain
                    base_path('app/Http/Controllers'), // Scan thư mục Controllers
                ],
            ],
        ],
    ],
    // ... các cấu hình khác
];
```

### 2.2 Tạo file metadata: `app/Http/Controllers/OpenApiController.php`
```php
<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Laravel API Documentation",
    version: "1.0.0",
    description: "API documentation for Laravel application",
    contact: new OA\Contact(email: "admin@example.com")
)]
#[OA\Server(
    url: "http://127.0.0.1:8000",
    description: "Local development server"
)]
#[OA\Server(
    url: "https://api.example.com",
    description: "Production server"
)]
class OpenApiController
{
    //
}
```

## 3. Sử dụng Swagger trong Controllers

### 3.1 Import OpenAPI Attributes
```php
use OpenApi\Attributes as OA;
```

### 3.2 Định nghĩa Schema cho Request/Response
```php
#[OA\Schema(
    schema: "StoreCategoryRequest",
    required: ["name", "slug"],
    properties: [
        new OA\Property(property: "name", type: "string", example: "Electronics"),
        new OA\Property(property: "slug", type: "string", example: "electronics"),
        new OA\Property(property: "description", type: "string", example: "Electronic products category")
    ]
)]
#[OA\Schema(
    schema: "UpdateCategoryRequest",
    properties: [
        new OA\Property(property: "name", type: "string", example: "Electronics"),
        new OA\Property(property: "slug", type: "string", example: "electronics"),
        new OA\Property(property: "description", type: "string", example: "Electronic products category")
    ]
)]
class CategoryController extends Controller
{
    // ...
}
```

### 3.3 Document các API endpoints

#### GET - Lấy danh sách
```php
#[OA\Get(
    path: "/api/v1/categories",
    summary: "Get list of categories",
    tags: ["Categories"],
    responses: [
        new OA\Response(response: 200, description: "Categories retrieved successfully")
    ]
)]
public function index()
{
    // ...
}
```

#### POST - Tạo mới
```php
#[OA\Post(
    path: "/api/v1/categories",
    summary: "Create a new category",
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/StoreCategoryRequest")
    ),
    tags: ["Categories"],
    responses: [
        new OA\Response(response: 201, description: "Category created successfully"),
        new OA\Response(response: 422, description: "Validation error")
    ]
)]
public function store(StoreCategoryRequest $request)
{
    // ...
}
```

#### GET - Lấy chi tiết theo ID/Slug
```php
#[OA\Get(
    path: "/api/v1/categories/{slug}",
    summary: "Get a category by slug",
    tags: ["Categories"],
    parameters: [
        new OA\Parameter(
            name: "slug",
            in: "path",
            required: true,
            schema: new OA\Schema(type: "string")
        )
    ],
    responses: [
        new OA\Response(response: 200, description: "Category retrieved successfully"),
        new OA\Response(response: 404, description: "Category not found")
    ]
)]
public function show(string $slug)
{
    // ...
}
```

#### PUT - Cập nhật
```php
#[OA\Put(
    path: "/api/v1/categories/{slug}",
    summary: "Update a category",
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(ref: "#/components/schemas/UpdateCategoryRequest")
    ),
    tags: ["Categories"],
    parameters: [
        new OA\Parameter(
            name: "slug",
            in: "path",
            required: true,
            schema: new OA\Schema(type: "string")
        )
    ],
    responses: [
        new OA\Response(response: 200, description: "Category updated successfully"),
        new OA\Response(response: 404, description: "Category not found"),
        new OA\Response(response: 422, description: "Validation error")
    ]
)]
public function update(UpdateCategoryRequest $request, string $slug)
{
    // ...
}
```

#### DELETE - Xóa
```php
#[OA\Delete(
    path: "/api/v1/categories/{slug}",
    summary: "Delete a category",
    tags: ["Categories"],
    parameters: [
        new OA\Parameter(
            name: "slug",
            in: "path",
            required: true,
            schema: new OA\Schema(type: "string")
        )
    ],
    responses: [
        new OA\Response(response: 200, description: "Category deleted successfully"),
        new OA\Response(response: 404, description: "Category not found")
    ]
)]
public function destroy(string $slug)
{
    // ...
}
```

## 4. Generate và sử dụng Swagger

### 4.1 Generate documentation
```bash
php artisan l5-swagger:generate
```

### 4.2 Truy cập Swagger UI
- **URL:** `http://127.0.0.1:8000/api/documentation`
- **JSON:** `http://127.0.0.1:8000/docs/api-docs.json`
- **YAML:** `http://127.0.0.1:8000/docs/api-docs.yaml`

### 4.3 Các lệnh hữu ích khác
```bash
# Generate với force override
php artisan l5-swagger:generate --force

# Publish lại config nếu cần
php artisan vendor:publish --provider="DarkaOnLine\L5Swagger\L5SwaggerServiceProvider" --force
```

## 5. Lưu ý quan trọng

### 5.1 Phiên bản swagger-php
- Dự án sử dụng `swagger-php v6.0.2`
- Ưu tiên sử dụng **PHP Attributes** thay vì Annotations cũ
- Import: `use OpenApi\Attributes as OA;`

### 5.2 Cấu trúc thư mục scan
Swagger sẽ scan các file trong:
- `app/Domain/` - Các Controller trong Domain
- `app/Http/Controllers/` - Các Controller khác

### 5.3 Tags và Grouping
Sử dụng `tags` để nhóm các API liên quan:
```php
tags: ["Categories"], // hoặc ["Products"], ["Brands"], v.v.
```

### 5.4 Response Schema
Để có response schema chi tiết hơn, có thể định nghĩa:
```php
#[OA\Schema(
    schema: "CategoryResponse",
    properties: [
        new OA\Property(property: "id", type: "integer"),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "slug", type: "string"),
        new OA\Property(property: "description", type: "string"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time")
    ]
)]
```

### 5.5 Authentication
Để thêm authentication cho API:
```php
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
```

## 6. Troubleshooting

### 6.1 Lỗi "Required @OA\PathItem() not found"
- Đảm bảo có file `OpenApiController.php` với `@OA\Info`
- Kiểm tra import `use OpenApi\Attributes as OA;`

### 6.2 Không thấy API trong Swagger UI
- Chạy lại: `php artisan l5-swagger:generate`
- Kiểm tra file `storage/api-docs/api-docs.json` có tồn tại
- Đảm bảo Controller có OpenAPI attributes

### 6.3 Lỗi scan annotations
- Kiểm tra đường dẫn trong `config/l5-swagger.php`
- Đảm bảo file Controller có syntax đúng

## 7. Ví dụ hoàn chỉnh

Xem các file Controller đã được document:
- `app/Domain/Category/Http/Controllers/CategoryController.php`
- `app/Domain/Brand/Http/Controllers/BrandController.php`
- `app/Domain/Product/Http/Controllers/ProductController.php`

## 8. Best Practices

1. **Đặt tên Schema rõ ràng:** `Store{Model}Request`, `Update{Model}Request`
2. **Sử dụng tags nhất quán:** "Categories", "Products", "Brands"
3. **Mô tả response chi tiết:** Thêm status codes và descriptions
4. **Validate input:** Sử dụng `required: true` cho các field bắt buộc
5. **Examples:** Thêm `example` cho các property để dễ test
6. **Consistent paths:** `/api/v1/{resource}` cho tất cả endpoints</content>
<parameter name="filePath">/Users/buimanhkhuong/Desktop/project/huong-dan/swagger.md
