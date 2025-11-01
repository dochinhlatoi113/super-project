<?php
// Simple standalone reindex script

$mysql = new PDO('mysql:host=laravel_mysql;port=3306;dbname=laravel', 'laravel', 'laravel');
$mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Fetch products with brand and category names
$stmt = $mysql->query("
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.brand_id,
        b.name as brand_name,
        p.category_id,
        c.name as category_name,
        p.is_active,
        p.created_at,
        p.updated_at
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.deleted_at IS NULL
    LIMIT 100
");

$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Fetched " . count($products) . " products\n";
echo "Reindexing to Elasticsearch...\n";

$success = 0;
$failed = 0;

foreach ($products as $product) {
    $data = [
        'id' => (int)$product['id'],
        'name' => $product['name'],
        'slug' => $product['slug'],
        'brand_id' => $product['brand_id'] ? (int)$product['brand_id'] : null,
        'brand_name' => $product['brand_name'],
        'category_id' => $product['category_id'] ? (int)$product['category_id'] : null,
        'category_name' => $product['category_name'],
        'is_active' => (bool)$product['is_active'],
        'created_at' => $product['created_at'],
        'updated_at' => $product['updated_at'],
        'variants' => [] // Skip variants for now
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://elasticsearch:9200/products/_doc/{$product['id']}");
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        $success++;
        echo ".";
    } else {
        $failed++;
        echo "X";
    }

    if (($success + $failed) % 50 == 0) {
        echo " [{$success} OK]\n";
    }
}

echo "\n\nDone! {$success} products reindexed with brand_name and category_name.\n";

// Verify
$lastProduct = end($products);
echo "\nVerifying product ID {$lastProduct['id']}...\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://elasticsearch:9200/products/_doc/{$lastProduct['id']}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

$doc = json_decode($result, true);
if (isset($doc['_source']['brand_name'])) {
    echo "✓ brand_name: {$doc['_source']['brand_name']}\n";
}
if (isset($doc['_source']['category_name'])) {
    echo "✓ category_name: {$doc['_source']['category_name']}\n";
}
