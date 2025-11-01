<?php

namespace App\Domain\Product\Console\Commands;

use App\Domain\Product\Entities\Product;
use App\Domain\Product\Services\Elasticsearch\ProductElasticsearchService;
use Illuminate\Console\Command;

class ReindexProducts extends Command
{
    protected $signature = 'product:es-reindex';
    protected $description = 'Reindex all existing products to Elasticsearch';

    public function handle(ProductElasticsearchService $esService): int
    {
        $this->info('Reindexing all products...');

        // Only index products that are NOT soft deleted
        $total = Product::whereNull('deleted_at')->count();

        if ($total === 0) {
            $this->warn('No active products found to index');
            return self::SUCCESS;
        }

        $this->info("Found {$total} active products");

        $this->info("Processing in {$total} products...");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $indexed = 0;

        Product::whereNull('deleted_at')
            ->with(['variants', 'brand', 'categories'])
            ->chunk($total, function ($products) use ($esService, &$indexed, $bar) {
                $productsData = $products->map(function ($product) {
                    $productArray = $product->toArray();

                    // Brand and category are already included from toArray() with relationships

                    // Include variants with their config
                    if ($product->variants) {
                        $productArray['variants'] = $product->variants->map(function ($variant) {
                            return [
                                'id' => $variant->id,
                                'name' => $variant->name,
                                'price' => $variant->price,
                                'stock' => $variant->stock,
                                'is_active' => $variant->is_active,
                                'config' => $variant->config
                            ];
                        })->toArray();
                    }

                    return $productArray;
                })->toArray();

                if ($esService->bulkIndex($productsData)) {
                    $indexed += count($productsData);
                }

                $bar->advance();
            });
        $bar->finish();
        $this->newLine();

        $this->info("✓ Successfully indexed {$indexed}/{$total} products");
        return self::SUCCESS;
    }
}
