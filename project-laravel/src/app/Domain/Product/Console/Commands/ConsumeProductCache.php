<?php
/**
 * Class ConsumeProductCache
 *
 * Console command for CLI operations
 * Provides command-line interface functionality
 */
namespace App\Domain\Product\Console\Commands;

use App\Domain\Product\Services\Kafka\ProductCacheConsumer;
use Illuminate\Console\Command;
use Junges\Kafka\Facades\Kafka;

class ConsumeProductCache extends Command
{
    protected $signature = 'product:kafka-cache';
    protected $description = 'Consume product events for cache invalidation (Consumer Group 2)';

    public function handle(ProductCacheConsumer $consumer): int
    {
        $this->info('Starting Product Cache Consumer (Group: product-cache-group)...');
        $this->info('Press Ctrl+C to stop');

        try {
            $kafkaConsumer = Kafka::consumer(
                topics: [config('kafka.topics.product_events')],
                groupId: 'product-cache-group',
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
