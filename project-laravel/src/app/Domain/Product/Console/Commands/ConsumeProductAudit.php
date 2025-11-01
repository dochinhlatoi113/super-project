<?php

namespace App\Domain\Product\Console\Commands;

use App\Domain\Product\Services\Kafka\ProductAuditConsumer;
use Illuminate\Console\Command;
use Junges\Kafka\Facades\Kafka;

class ConsumeProductAudit extends Command
{
    protected $signature = 'product:kafka-audit';
    protected $description = 'Consume product events for audit logging (Consumer Group 1)';

    public function handle(ProductAuditConsumer $consumer): int
    {
        $this->info('Starting Product Audit Consumer (Group: product-audit-group)...');
        $this->info('Press Ctrl+C to stop');

        try {
            $kafkaConsumer = Kafka::consumer(
                topics: [config('kafka.topics.product_events')],
                groupId: 'product-audit-group',
                brokers: config('kafka.brokers')
            )
            ->withHandler([$consumer, 'handle'])
            ->build();

            $kafkaConsumer->consume();

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Consumer failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
