<?php

namespace App\Domain\Product\Services\Kafka;

use Illuminate\Support\Facades\Log;
use Junges\Kafka\Contracts\ConsumerMessage;

/**
 * Consumer Group 1: Audit/Logging
 * Purpose: logs(CREATE/UPDATE/DELETE)
 */
class ProductAuditConsumer
{
    protected ProductDlqProducer $dlqProducer;

    public function __construct(ProductDlqProducer $dlqProducer)
    {
        $this->dlqProducer = $dlqProducer;
    }

    public function handle(ConsumerMessage $message): void
    {
        $body = $message->getBody();

        try {
            $action = $body['action'] ?? 'unknown';
            $productId = $body['product_id'] ?? 'N/A';
            $productName = $body['product_name'] ?? 'N/A';
            $timestamp = $body['timestamp'] ?? now()->toIso8601String();

            // log audit
            Log::channel('kafka')->info("[Kafka Audit] Product {$action}", [
                'action' => $action,
                'product_id' => $productId,
                'product_name' => $productName,
                'timestamp' => $timestamp,
                'data' => $body['data'] ?? []
            ]);

            // AuditLog::create([...]);
        } catch (\Throwable $e) {
            Log::channel('kafka')->error("[Kafka Audit] Failed to process message", [
                'error' => $e->getMessage(),
                'product_id' => $body['product_id'] ?? null
            ]);

            // Send to DLQ
            $this->dlqProducer->sendToDlq($body, $e, 'product-audit-group');
        }
    }
}
