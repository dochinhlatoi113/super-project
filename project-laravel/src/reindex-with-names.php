<?php
require __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get services
$productService = app(\App\Domain\Product\Services\Elasticsearch\ProductElasticsearchService::class);

// Get first 100 products with brand and category
$products = \App\Domain\Product\Entities\Product::with(['brand', 'category', 'variants'])
    ->limit(100)
    ->get();

echo "Reindexing {$products->count()} products with brand_name and category_name...\n";

$success = 0;
$failed = 0;

foreach ($products as $product) {
    $productData = $product->toArray();

    if ($productService->indexProduct($productData)) {
        $success++;
        echo ".";
    } else {
        $failed++;
        echo "X";
    }

    if (($success + $failed) % 50 == 0) {
        echo " [{$success} OK, {$failed} failed]\n";
    }
}

echo "\n\nDone! {$success} products indexed successfully, {$failed} failed.\n";

// Verify one product
echo "\nVerifying last indexed product (ID: {$product->id})...\n";
exec("curl -s 'http://localhost:9200/products/_doc/{$product->id}?pretty' | grep -A5 'brand_name\\|category_name'", $output);
echo implode("\n", $output) . "\n";
