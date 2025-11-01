<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\ProductVariant\Entities\ProductVariant;
use App\Domain\ProductSku\Services\ProductSkuService;
use Illuminate\Support\Facades\App;

class ProductSkuSeeder extends Seeder
{
    public function run()
    {
        $skuService = App::make(ProductSkuService::class);

        // Get all existing variants
        $variants = ProductVariant::all();

        if ($variants->isEmpty()) {
            $this->command->info('No product variants found. Run ProductSeeder first.');
            return;
        }

        $this->command->info("Creating SKUs for {$variants->count()} variants...");

        $createdCount = 0;

        foreach ($variants as $variant) {
            try {
                // Create primary SKU
                $skuData = [
                    'product_variant_id' => $variant->id,
                    'is_primary' => true,
                    'type' => 'sku'
                ];

                $sku = $skuService->create($skuData);
                $createdCount++;

                // Create additional barcode for some variants (EAN)
                if (rand(1, 3) === 1) { // 33% chance
                    $barcodeData = [
                        'product_variant_id' => $variant->id,
                        'is_primary' => false,
                        'type' => 'ean'
                    ];

                    $skuService->create($barcodeData);
                    $createdCount++;
                }
            } catch (\Exception $e) {
                $this->command->error("Failed to create SKU for variant {$variant->id}: " . $e->getMessage());
            }
        }

        $this->command->info("✅ Created {$createdCount} SKUs for product variants");
    }
}
