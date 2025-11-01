<?php

namespace App\Domain\Product\Services\Kafka;

use Illuminate\Support\Facades\Log;
use Junges\Kafka\Facades\Kafka;
use Junges\Kafka\Message\Message;

/**
 * DLQ Producer for failed product events
 */
class ProductDlqProducer
{
    protected string $dlqTopic;

    public function __construct()
    {
        $this->dlqTopic = config('kafka.topics.product_events_dlq');
    }

    /**
     * Send failed message to DLQ
     *
     * @param array $originalMessage Original message body
     * @param \Throwable $exception The exception that caused the failure
     * @param string $consumerGroup The consumer group that failed
     */
    public function sendToDlq(array $originalMessage, \Throwable $exception, string $consumerGroup): void
    {
        try {
            $dlqMessage = new Message(
                body: [
                    'original_message' => $originalMessage,
                    'error' => $exception->getMessage(),
                    'consumer_group' => $consumerGroup,
                    'failed_at' => now()->toIso8601String(),
                    'retry_count' => ($originalMessage['retry_count'] ?? 0) + 1,
                    'stack_trace' => $exception->getTraceAsString()
                ]
            );

            Kafka::publish(config('kafka.brokers'))
                ->onTopic($this->dlqTopic)
                ->withMessage($dlqMessage)
                ->send();

            Log::channel('kafka')->warning("[DLQ] Message sent to DLQ", [
                'consumer_group' => $consumerGroup,
                'error' => $exception->getMessage(),
                'product_id' => $originalMessage['product_id'] ?? null
            ]);
        } catch (\Throwable $e) {
            Log::channel('kafka')->error("[DLQ] Failed to send to DLQ", [
                'error' => $e->getMessage(),
                'original_error' => $exception->getMessage()
            ]);
        }
    }
}
