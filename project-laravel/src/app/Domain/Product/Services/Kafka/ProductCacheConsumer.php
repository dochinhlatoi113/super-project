<?php

namespace App\Domain\Product\Services\Kafka;

use App\Domain\Product\Contracts\ProductCacheInterface;
use Illuminate\Support\Facades\Log;
use Junges\Kafka\Contracts\ConsumerMessage;

/**
 * Consumer Group 2: Cache Invalidation
 * Purpose:logs (CREATE/UPDATE/DELETE)
 */
class ProductCacheConsumer
{
    protected ProductCacheInterface $cache;
    protected ProductDlqProducer $dlqProducer;

    public function __construct(ProductCacheInterface $cache, ProductDlqProducer $dlqProducer)
    {
        $this->cache = $cache;
        $this->dlqProducer = $dlqProducer;
    }

    public function handle(ConsumerMessage $message): void
    {
        $body = $message->getBody();
        $action = $body['action'] ?? 'unknown';
        $productId = $body['product_id'] ?? 'N/A';

        try {
            $this->cache->flush();

            Log::channel('kafka')->info("[Kafka Cache] Cache cleared after {$action}", [
                'action' => $action,
                'product_id' => $productId
            ]);
        } catch (\Throwable $e) {
            Log::channel('kafka')->error("[Kafka Cache] Failed to clear cache", [
                'error' => $e->getMessage(),
                'action' => $action,
                'product_id' => $productId
            ]);

            // Send to DLQ
            $this->dlqProducer->sendToDlq($body, $e, 'product-cache-group');
        }
    }
}
