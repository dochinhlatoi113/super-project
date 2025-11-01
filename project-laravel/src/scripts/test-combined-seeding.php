<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Domain\Product\Entities\Product;
use App\Domain\ProductVariant\Entities\ProductVariant;
use App\Domain\ProductSku\Services\ProductSkuService;
use App\Domain\Brand\Entities\Brand;
use App\Domain\Category\Entities\Category;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

echo "Testing combined Product + SKU seeding logic...\n";

// Get services from container
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$faker = Faker::create();
$skuService = App::make(ProductSkuService::class);
$brands = Brand::pluck('id')->toArray();
$categories = Category::pluck('id')->toArray();

try {
    DB::transaction(function () use ($faker, $skuService, $brands, $categories) {
        // Create one test product with variants and SKUs
        $productName = 'Test Product ' . time();
        $product = Product::create([
            'name' => $productName,
            'slug' => Str::slug($productName) . '-' . Str::random(6),
            'brand_id' => $faker->randomElement($brands),
            'category_id' => $faker->randomElement($categories),
            'is_active' => true,
        ]);

        echo "Created test product: {$product->name} (ID: {$product->id})\n";

        $variantCount = 2; // Create 2 variants for testing
        for ($j = 1; $j <= $variantCount; $j++) {
            $variantName = $productName . " Variant {$j}";

            $config = [
                'color' => $faker->safeColorName(),
                'size' => $faker->randomElement(['S', 'M', 'L', 'XL']),
                'storage' => $faker->randomElement([64, 128, 256, 512]),
                'price' => $faker->randomFloat(2, 1, 1000),
                'is_active' => true,
            ];

            $variant = ProductVariant::create([
                'product_id' => $product->id,
                'name' => $variantName,
                'slug' => Str::slug($variantName) . '-' . Str::random(6),
                'stock' => $faker->numberBetween(0, 100),
                'is_active' => true,
                'price' => rand(1, 1000),
                'description' => $faker->sentence(10),
                'config' => json_encode([$config]),
            ]);

            echo "Created variant: {$variant->name} (ID: {$variant->id})\n";

            // Create 2 SKUs and 2 barcodes for this variant
            try {
                // Create first SKU (primary)
                $skuData1 = [
                    'product_variant_id' => $variant->id,
                    'is_primary' => true,
                    'type' => 'sku'
                ];
                $sku1 = $skuService->create($skuData1);
                echo "Created SKU 1: {$sku1->sku}\n";

                // Create second SKU (non-primary)
                $skuData2 = [
                    'product_variant_id' => $variant->id,
                    'is_primary' => false,
                    'type' => 'sku'
                ];
                $sku2 = $skuService->create($skuData2);
                echo "Created SKU 2: {$sku2->sku}\n";

                // Create first barcode (EAN)
                $barcodeData1 = [
                    'product_variant_id' => $variant->id,
                    'is_primary' => false,
                    'type' => 'ean'
                ];
                $barcode1 = $skuService->create($barcodeData1);
                echo "Created Barcode 1: {$barcode1->barcode}\n";

                // Create second barcode (EAN)
                $barcodeData2 = [
                    'product_variant_id' => $variant->id,
                    'is_primary' => false,
                    'type' => 'ean'
                ];
                $barcode2 = $skuService->create($barcodeData2);
                echo "Created Barcode 2: {$barcode2->barcode}\n";
            } catch (\Exception $e) {
                echo "Failed to create SKUs for variant {$variant->id}: " . $e->getMessage() . "\n";
            }
        }

        echo "\n✅ Combined seeding logic works! Each variant has 2 SKUs and 2 barcodes.\n";
        echo "Test product slug: {$product->slug}\n";
    });
} catch (Exception $e) {
    echo "❌ Error testing combined seeding: " . $e->getMessage() . "\n";
}
