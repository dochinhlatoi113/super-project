# Test Slug Operations - Product, Category, Brand

## ✅ Changes Applied

### All Domains (Product, Category, Brand):

1. **Auto-generate slug from name** if slug is empty using `Str::slug()`
2. **Update operations use slug** instead of ID
3. **Delete operations use slug** instead of ID
4. **Unique slug generation** with auto-increment suffix if duplicate

---

## 🧪 Test Cases

### 1. **Product Operations**

#### Get Product by slug

```bash
curl -X GET http://localhost/api/v1/products/corporis-numquam-YEU6bl
```

**Expected**: Returns product with variants, brand, category

#### Create Product (auto-generate slug)

```bash
curl -X POST http://localhost/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "iPhone 15 Pro Max",
      "brand_id": 1,
      "category_id": 2,
      "is_active": true
    }
  }'
```

**Expected**: Slug auto-generated as `iphone-15-pro-max`

#### Create Product with custom slug

```bash
curl -X POST http://localhost/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "iPhone 15 Pro Max",
      "slug": "custom-iphone-slug",
      "brand_id": 1,
      "category_id": 2,
      "is_active": true
    }
  }'
```

**Expected**: Uses provided slug `custom-iphone-slug`

#### Update Product by slug

```bash
curl -X PUT http://localhost/api/v1/products/iphone-15-pro-max \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "iPhone 15 Pro Max Updated",
      "brand_id": 1,
      "category_id": 2,
      "is_active": true
    }
  }'
```

**Expected**: Product updated, slug remains or auto-generates if empty

#### Delete Product by slug

```bash
curl -X DELETE http://localhost/api/v1/products/iphone-15-pro-max
```

**Expected**: Product deleted successfully

---

### 2. **Category Operations**

#### Create Category (auto-generate slug)

```bash
curl -X POST http://localhost/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Điện Thoại Thông Minh",
    "has_promotion": true,
    "order": 1,
    "status": 1
  }'
```

**Expected**: Slug auto-generated as `dien-thoai-thong-minh`

#### Update Category by slug

```bash
curl -X PUT http://localhost/api/v1/categories/dien-thoai-thong-minh \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone Premium",
    "has_promotion": false,
    "order": 1,
    "status": 1
  }'
```

#### Delete Category by slug

```bash
curl -X DELETE http://localhost/api/v1/categories/dien-thoai-thong-minh
```

---

### 3. **Brand Operations**

#### Create Brand (auto-generate slug)

```bash
curl -X POST http://localhost/api/v1/brands \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Electronics",
    "has_promotion": true,
    "order": 1,
    "status": 1
  }'
```

**Expected**: Slug auto-generated as `samsung-electronics`

#### Update Brand by slug

```bash
curl -X PUT http://localhost/api/v1/brands/samsung-electronics \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Global",
    "has_promotion": false,
    "order": 2,
    "status": 1
  }'
```

#### Delete Brand by slug

```bash
curl -X DELETE http://localhost/api/v1/brands/samsung-electronics
```

---

## 🔍 Testing Duplicate Slug Handling

### Create multiple products with same name

```bash
# First product
curl -X POST http://localhost/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "Laptop Dell",
      "brand_id": 1,
      "category_id": 2
    }
  }'
# Expected slug: laptop-dell

# Second product (duplicate name)
curl -X POST http://localhost/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "Laptop Dell",
      "brand_id": 1,
      "category_id": 2
    }
  }'
# Expected slug: laptop-dell-1

# Third product (duplicate name)
curl -X POST http://localhost/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "Laptop Dell",
      "brand_id": 1,
      "category_id": 2
    }
  }'
# Expected slug: laptop-dell-2
```

---

## 📋 Summary of Changes

### Modified Files:

#### Product Domain:

-   ✅ `Product.php` - Added boot() method with auto-slug generation
-   ✅ `ProductRepositoryInterface.php` - Added findBySlug, updateBySlug, deleteBySlug
-   ✅ `ProductRepository.php` - Implemented slug-based methods
-   ✅ `ProductService.php` - Changed update($slug), delete($slug)
-   ✅ `ProductController.php` - Changed update(string $slug), destroy(string $slug)

#### Category Domain:

-   ✅ `Category.php` - Added boot() method with auto-slug generation
-   ✅ `CategoryRepositoryInterface.php` - Added slug-based methods
-   ✅ `CategoryRepository.php` - Implemented slug-based methods
-   ✅ `CategoryService.php` - Changed to use slug
-   ✅ `CategoryController.php` - Changed to use slug

#### Brand Domain:

-   ✅ `Brand.php` - Added boot() method with auto-slug generation
-   ✅ `BrandRepositoryInterface.php` - Added slug-based methods
-   ✅ `BrandRepository.php` - Implemented slug-based methods
-   ✅ `BrandService.php` - Changed to use slug
-   ✅ `BrandController.php` - Changed to use slug

---

## 🎯 Key Features:

1. **Automatic slug generation**: If slug is empty, auto-generate from `name` using `Str::slug()`
2. **Unique slugs**: If duplicate, adds suffix `-1`, `-2`, etc.
3. **Vietnamese support**: `Str::slug()` handles Vietnamese characters (e.g., "Điện thoại" → "dien-thoai")
4. **Slug-based operations**: All update/delete use slug instead of numeric ID
5. **Custom slug support**: Can still provide custom slug when creating

---

## ⚠️ Important Notes:

-   **Routes must accept string parameter** for slug (already updated in controllers)
-   **Existing products** will keep their current slugs
-   **New products** without slug will auto-generate
-   **Kafka events** still work (using toArray() which includes slug)
-   **Elasticsearch sync** still works (slug is indexed)
