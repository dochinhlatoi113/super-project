<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Domain\Product\Services\ProductService;
use App\Domain\ProductVariant\Services\ProductVariantService;
use App\Domain\ProductSku\Services\ProductSkuService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "Creating product with 2 variants...\n";

// Get services from container
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$productService = app(ProductService::class);
$variantService = app(ProductVariantService::class);
$skuService = app(ProductSkuService::class);

try {
    DB::transaction(function () use ($productService, $variantService, $skuService) {
        // Create product
        $productData = [
            'name' => 'iPhone 15 Pro Max',
            'brand_id' => 1, // Apple brand
            'category_id' => 2, // Smart Phones category
            'is_active' => true,
            'slug' => 'iphone-15-pro-max-' . time(),
        ];

        $product = app(\App\Domain\Product\Repositories\ProductRepositoryInterface::class)->create($productData);
        echo "Created product: {$product->name} (ID: {$product->id})\n";

        // Variant 1: 256GB - Blue
        $variant1Data = [
            'product_id' => $product->id,
            'name' => 'iPhone 15 Pro Max 256GB Blue',
            'price' => 1199.99,
            'stock' => 50,
            'is_active' => true,
            'config' => [
                [
                    'color' => 'blue',
                    'size' => '256GB',
                    'storage' => 256,
                    'price' => 1199.99,
                    'is_active' => true,
                    'income_number' => 1
                ]
            ]
        ];

        $variant1 = $variantService->create($variant1Data);
        // The create method returns array with product_variant_id, get the actual variant
        $variant1Obj = \App\Domain\ProductVariant\Entities\ProductVariant::find($variant1['product_variant_id']);
        echo "Created variant 1: {$variant1Obj->name} (ID: {$variant1Obj->id})\n";

        // Create 2 SKUs and 2 barcodes for Variant 1
        try {
            // SKU 1 (primary)
            $sku1Data = [
                'product_variant_id' => $variant1Obj->id,
                'sku' => 'IPH15PM-256-BLU-001',
                'barcode' => null,
                'type' => 'sku',
                'is_primary' => true,
                'is_active' => true
            ];
            $sku1 = $skuService->create($sku1Data);
            echo "Created SKU 1 for variant 1: {$sku1->sku}\n";

            // SKU 2 (non-primary)
            $sku2Data = [
                'product_variant_id' => $variant1Obj->id,
                'sku' => 'IPH15PM-256-BLU-001-ALT',
                'barcode' => null,
                'type' => 'sku',
                'is_primary' => false,
                'is_active' => true
            ];
            $sku2 = $skuService->create($sku2Data);
            echo "Created SKU 2 for variant 1: {$sku2->sku}\n";

            // Barcode 1
            $barcode1Data = [
                'product_variant_id' => $variant1Obj->id,
                'sku' => null,
                'barcode' => '123456789012',
                'type' => 'ean',
                'is_primary' => false,
                'is_active' => true
            ];
            $barcode1 = $skuService->create($barcode1Data);
            echo "Created Barcode 1 for variant 1: {$barcode1->barcode}\n";

            // Barcode 2
            $barcode2Data = [
                'product_variant_id' => $variant1Obj->id,
                'sku' => null,
                'barcode' => '123456789013',
                'type' => 'ean',
                'is_primary' => false,
                'is_active' => true
            ];
            $barcode2 = $skuService->create($barcode2Data);
            echo "Created Barcode 2 for variant 1: {$barcode2->barcode}\n";
        } catch (Exception $e) {
            echo "Error creating SKUs for variant 1: " . $e->getMessage() . "\n";
        }

        // Variant 2: 512GB - Black
        $variant2Data = [
            'product_id' => $product->id,
            'name' => 'iPhone 15 Pro Max 512GB Black',
            'price' => 1399.99,
            'stock' => 30,
            'is_active' => true,
            'config' => [
                [
                    'color' => 'black',
                    'size' => '512GB',
                    'storage' => 512,
                    'price' => 1399.99,
                    'is_active' => true,
                    'income_number' => 1
                ]
            ]
        ];

        $variant2 = $variantService->create($variant2Data);
        // The create method returns array with product_variant_id, get the actual variant
        $variant2Obj = \App\Domain\ProductVariant\Entities\ProductVariant::find($variant2['product_variant_id']);
        echo "Created variant 2: {$variant2Obj->name} (ID: {$variant2Obj->id})\n";

        // Create 2 SKUs and 2 barcodes for Variant 2
        try {
            // SKU 1 (primary)
            $sku3Data = [
                'product_variant_id' => $variant2Obj->id,
                'sku' => 'IPH15PM-512-BLK-002',
                'barcode' => null,
                'type' => 'sku',
                'is_primary' => true,
                'is_active' => true
            ];
            $sku3 = $skuService->create($sku3Data);
            echo "Created SKU 1 for variant 2: {$sku3->sku}\n";

            // SKU 2 (non-primary)
            $sku4Data = [
                'product_variant_id' => $variant2Obj->id,
                'sku' => 'IPH15PM-512-BLK-002-ALT',
                'barcode' => null,
                'type' => 'sku',
                'is_primary' => false,
                'is_active' => true
            ];
            $sku4 = $skuService->create($sku4Data);
            echo "Created SKU 2 for variant 2: {$sku4->sku}\n";

            // Barcode 1
            $barcode3Data = [
                'product_variant_id' => $variant2Obj->id,
                'sku' => null,
                'barcode' => '987654321098',
                'type' => 'ean',
                'is_primary' => false,
                'is_active' => true
            ];
            $barcode3 = $skuService->create($barcode3Data);
            echo "Created Barcode 1 for variant 2: {$barcode3->barcode}\n";

            // Barcode 2
            $barcode4Data = [
                'product_variant_id' => $variant2Obj->id,
                'sku' => null,
                'barcode' => '987654321099',
                'type' => 'ean',
                'is_primary' => false,
                'is_active' => true
            ];
            $barcode4 = $skuService->create($barcode4Data);
            echo "Created Barcode 2 for variant 2: {$barcode4->barcode}\n";
        } catch (Exception $e) {
            echo "Error creating SKUs for variant 2: " . $e->getMessage() . "\n";
        }

        echo "\n✅ Product created successfully!\n";
        echo "Product: {$product->name}\n";
        echo "Variant 1: {$variant1Obj->name} - Price: \${$variant1Obj->price}\n";
        echo "  - SKUs: IPH15PM-256-BLU-001, IPH15PM-256-BLU-001-ALT\n";
        echo "  - Barcodes: 123456789012, 123456789013\n";
        echo "Variant 2: {$variant2Obj->name} - Price: \${$variant2Obj->price}\n";
        echo "  - SKUs: IPH15PM-512-BLK-002, IPH15PM-512-BLK-002-ALT\n";
        echo "  - Barcodes: 987654321098, 987654321099\n";
        echo "\nYou can test the product at: http://localhost/api/v1/products/detail/{$product->slug}\n";
    });
} catch (Exception $e) {
    echo "❌ Error creating product: " . $e->getMessage() . "\n";
    Log::error('Product creation failed', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
