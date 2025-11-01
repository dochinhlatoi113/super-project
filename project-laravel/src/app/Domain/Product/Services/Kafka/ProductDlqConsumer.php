<?php

namespace App\Domain\Product\Services\Kafka;

use App\Jobs\RetryDlqMessage;
use Illuminate\Support\Facades\Log;
use Junges\Kafka\Contracts\ConsumerMessage;

/**
 * Consumer for DLQ messages - retries failed messages
 */
class ProductDlqConsumer
{
    public function handle(ConsumerMessage $message): void
    {
        $body = $message->getBody();

        try {
            $originalMessage = $body['original_message'];
            $retryCount = $originalMessage['retry_count'] ?? 0;

            Log::channel('kafka')->info("[DLQ Consumer] Processing DLQ message", [
                'retry_count' => $retryCount,
                'product_id' => $originalMessage['product_id'] ?? null,
                'consumer_group' => $body['consumer_group'] ?? 'unknown'
            ]);

            // Dispatch retry job
            RetryDlqMessage::dispatch($body);

            Log::channel('kafka')->info("[DLQ Consumer] Dispatched retry job", [
                'product_id' => $originalMessage['product_id'] ?? null
            ]);
        } catch (\Throwable $e) {
            Log::channel('kafka')->error("[DLQ Consumer] Failed to process DLQ message", [
                'error' => $e->getMessage(),
                'dlq_message' => $body
            ]);
        }
    }
}
