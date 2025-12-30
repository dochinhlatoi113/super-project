<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Domain\Product\Entities\Product;
use App\Domain\ProductVariant\Entities\ProductVariant;
use App\Domain\ProductSku\Services\ProductSkuService;
use App\Domain\Brand\Entities\Brand;
use App\Domain\Category\Entities\Category;
use Illuminate\Support\Facades\App;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $skuService = App::make(ProductSkuService::class);
        $brands = Brand::pluck('id')->toArray();
        $categories = Category::pluck('id')->toArray();

        for ($i = 0; $i < 109581; $i++) {  // Giảm số lượng để test
            $productName = $faker->words(2, true);
            $product = Product::create([
                'name' => $productName,
                'slug' => Str::slug($productName) . '-' . Str::random(6),
                'brand_id' => $faker->randomElement($brands),
                'is_active' => $faker->boolean(90),
            ]);

            // Attach categories
            $categoryIds = $faker->randomElements($categories, rand(1, 3));
            foreach ($categoryIds as $index => $categoryId) {
                $product->categories()->attach($categoryId, [
                    'is_primary' => $index === 0 ? 1 : 0,  // First category is primary
                    'is_active' => 1,
                ]);
            }

            $variantCount = rand(1, 3);
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
                    'description' => $faker->sentence(10),
                    'config' => json_encode([$config, $config]),
                ]);

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
                    // Log error but continue
                    $this->command->error("Failed to create SKUs for variant {$variant->id}: " . $e->getMessage());
                }
            }
        }

        $this->command->info("✅ Created products with variants, 2 SKUs and 2 barcodes each");
    }
}
