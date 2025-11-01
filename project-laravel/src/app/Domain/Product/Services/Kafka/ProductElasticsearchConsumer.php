<?php

namespace App\Domain\Product\Services\Kafka;

use App\Domain\Product\Services\Elasticsearch\ProductElasticsearchService;
use Illuminate\Support\Facades\Log;
use Junges\Kafka\Contracts\ConsumerMessage;

/**
 * Consumer Group 3: Elasticsearch sync
 * Purpose: sync product create/update/delete events into Elasticsearch
 */
class ProductElasticsearchConsumer
{
    protected ProductElasticsearchService $esService;
    protected ProductDlqProducer $dlqProducer;

    public function __construct(ProductElasticsearchService $esService, ProductDlqProducer $dlqProducer)
    {
        $this->esService = $esService;
        $this->dlqProducer = $dlqProducer;
    }

    public function handle(ConsumerMessage $message): void
    {
        $body = $message->getBody();
        $action = $body['action'] ?? 'unknown';
        $productId = $body['product_id'] ?? null;

        try {
            if ($action === 'created' || $action === 'updated') {
                $data = $body['data'];
                // Ensure the data has the correct id from the message
                $data['id'] = $productId;
                $this->esService->indexProduct($data);
                Log::channel('elasticsearch')->info("[Kafka ES] Product indexed/updated", [
                    'action' => $action,
                    'product_id' => $productId
                ]);
            } elseif ($action === 'deleted') {
                if ($productId !== null) {
                    $this->esService->deleteProduct((int)$productId);
                    Log::channel('elasticsearch')->info("[Kafka ES] Product marked inactive", [
                        'action' => $action,
                        'product_id' => $productId
                    ]);
                }
            } else {
                Log::channel('elasticsearch')->warning("[Kafka ES] Unknown action received", [
                    'action' => $action,
                    'payload' => $body
                ]);
            }
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error('[Kafka ES] Consumer failed', [
                'error' => $e->getMessage(),
                'action' => $action,
                'product_id' => $productId
            ]);

            // Send to DLQ
            $this->dlqProducer->sendToDlq($body, $e, 'product-elasticsearch-group');
        }
    }
}
