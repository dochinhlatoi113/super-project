<?php
/**
 * Class CreateProductEventsTopic
 *
 * Console command for CLI operations
 * Provides command-line interface functionality
 */
namespace App\Domain\Product\Console\Commands;

use Illuminate\Console\Command;
use Junges\Kafka\Facades\Kafka;

class CreateProductEventsTopic extends Command
{
    protected $signature = 'product:kafka-create-topic';
    protected $description = 'Create Kafka topic for product events';

    public function handle(): int
    {
        $topic = config('kafka.topics.product_events');
        $this->info("Creating Kafka topic: {$topic}");

        try {
            Kafka::createTopic($topic)
                ->withPartitions(3) // chạy song song 3 partitions
                ->withReplicationFactor(1) // chỉ định 1 bản sao
                ->build();

            $this->info("Topic '{$topic}' created successfully!");
            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to create topic: " . $e->getMessage());
            return self::FAILURE;
        }
    }
}
