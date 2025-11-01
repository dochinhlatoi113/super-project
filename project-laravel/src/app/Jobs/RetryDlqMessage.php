<?php

namespace App\Jobs;

use App\Domain\Product\Services\Kafka\ProductEventProducer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job to retry messages from DLQ
 */
class RetryDlqMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $dlqMessage;
    public int $maxRetries = 3;

    public function __construct(array $dlqMessage)
    {
        $this->dlqMessage = $dlqMessage;
    }

    public function handle(ProductEventProducer $producer): void
    {
        $originalMessage = $this->dlqMessage['original_message'];
        $retryCount = $originalMessage['retry_count'] ?? 0;

        if ($retryCount >= $this->maxRetries) {
            Log::channel('kafka')->error("[DLQ Retry] Max retries exceeded", [
                'retry_count' => $retryCount,
                'product_id' => $originalMessage['product_id'] ?? null
            ]);
            return;
        }

        try {
            // Retry by publishing back to original topic
            $producer->publishEvent(
                $originalMessage['action'],
                $originalMessage['data']
            );

            Log::channel('kafka')->info("[DLQ Retry] Message retried successfully", [
                'retry_count' => $retryCount + 1,
                'product_id' => $originalMessage['product_id'] ?? null
            ]);
        } catch (\Throwable $e) {
            Log::channel('kafka')->error("[DLQ Retry] Retry failed", [
                'error' => $e->getMessage(),
                'retry_count' => $retryCount + 1,
                'product_id' => $originalMessage['product_id'] ?? null
            ]);

            // If still failing, could dispatch another retry with delay
            if ($retryCount + 1 < $this->maxRetries) {
                self::dispatch($this->dlqMessage)->delay(now()->addMinutes(5 * ($retryCount + 1)));
            }
        }
    }
}
