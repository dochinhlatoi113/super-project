<?php

namespace App\Domain\Product\Console\Commands;

use App\Domain\Product\Services\Kafka\ProductDlqConsumer;
use Illuminate\Console\Command;
use Junges\Kafka\Facades\Kafka;

class ConsumeProductDlq extends Command
{
    protected $signature = 'product:kafka-dlq';
    protected $description = 'Consume DLQ messages and retry failed product events';

    public function handle(ProductDlqConsumer $consumer): int
    {
        $this->info('Starting DLQ Consumer...');
        $this->info('Press Ctrl+C to stop');

        try {
            $kafkaConsumer = Kafka::consumer(
                topics: [config('kafka.topics.product_events_dlq')],
                groupId: 'product-dlq-group',
                brokers: config('kafka.brokers')
            )
                ->withHandler([$consumer, 'handle'])
                ->build();

            $kafkaConsumer->consume();

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('DLQ Consumer failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
