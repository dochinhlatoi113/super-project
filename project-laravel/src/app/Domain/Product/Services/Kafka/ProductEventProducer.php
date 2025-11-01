<?php

namespace App\Domain\Product\Services\Kafka;

use Illuminate\Support\Facades\Log;
use Junges\Kafka\Facades\Kafka;
use Junges\Kafka\Message\Message;

class ProductEventProducer
{
    protected string $topic;

    public function __construct()
    {
        $this->topic = config('kafka.topics.product_events');
    }

    /**
     * Publish product event to Kafka with fallback
     * 
     * @param string $action - 'created', 'updated', 'deleted'
     * @param array $productData - Product data
     */
    public function publishEvent(string $action, array $productData): void
    {
        try {
            $message = new Message(
                body: [
                    'action' => $action,
                    'product_id' => $productData['id'] ?? null,
                    'product_name' => $productData['product_name'] ?? null,
                    'timestamp' => now()->toIso8601String(),
                    'data' => $productData
                ]
            );

            Kafka::publish(config('kafka.brokers'))
                ->onTopic($this->topic)
                ->withMessage($message)
                ->send();

            Log::channel('product')->info("[Kafka Producer] Event published", [
                'topic' => $this->topic,
                'action' => $action,
                'product_id' => $productData['id'] ?? null
            ]);
        } catch (\Throwable $e) {
            Log::channel('product')->warning("[Kafka Producer] Kafka failed, using fallback", [
                'error' => $e->getMessage(),
                'action' => $action,
                'product_id' => $productData['id'] ?? null
            ]);

            // Fallback: Process synchronously
            $this->processEventSynchronously($action, $productData);
        }
    }

    /**
     * Fallback method: Process event synchronously when Kafka is unavailable
     */
    protected function processEventSynchronously(string $action, array $productData): void
    {
        echo "🔄 [DEBUG] Processing event synchronously: {$action}\n";

        try {
            // Import services here to avoid circular dependencies
            $cacheService = app(\App\Domain\Product\Contracts\ProductCacheInterface::class);
            $elasticsearchService = app(\App\Domain\Product\Services\Elasticsearch\ProductElasticsearchService::class);

            $productId = $productData['id'] ?? null;

            // Clear cache (same as ProductCacheConsumer)
            $cacheService->flush();

            // Update Elasticsearch (same as ProductElasticsearchConsumer)
            if ($action === 'deleted') {
                if ($productId !== null) {
                    $elasticsearchService->deleteProduct((int)$productId);
                }
            } else {
                $productData['id'] = $productId; // Ensure correct ID
                $elasticsearchService->indexProduct($productData);
            }

            // Log audit (same as ProductAuditConsumer)
            \Illuminate\Support\Facades\Log::channel('kafka')->info("[Fallback Audit] Product {$action}", [
                'action' => $action,
                'product_id' => $productId,
                'product_name' => $productData['product_name'] ?? 'N/A',
                'timestamp' => now()->toIso8601String(),
                'data' => $productData
            ]);

            \Illuminate\Support\Facades\Log::channel('product')->info("[Fallback] Event processed synchronously", [
                'action' => $action,
                'product_id' => $productId
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::channel('product')->error("[Fallback] Synchronous processing failed", [
                'error' => $e->getMessage(),
                'action' => $action,
                'product_id' => $productData['id'] ?? null
            ]);
        }
    }
}
