<?php

namespace App\Domain\Product\Console\Commands;

use App\Domain\Product\Services\Kafka\ProductElasticsearchConsumer;
use Illuminate\Console\Command;
use Junges\Kafka\Facades\Kafka;

class ConsumeProductElasticsearch extends Command
{
    protected $signature = 'product:kafka-elasticsearch';
    protected $description = 'Consume product events for Elasticsearch sync (Consumer Group 3)';

    public function handle(ProductElasticsearchConsumer $consumer): int
    {
        $this->info('Starting Product Elasticsearch Consumer (Group: product-elasticsearch-group)...');
        $this->info('Press Ctrl+C to stop');

        // Wait for Kafka to be ready
        $this->info('Waiting 20 seconds for Kafka to be ready...');
        // sleep(20);

        try {
            $brokers = env('KAFKA_BROKERS', 'kafka:9092');
            $this->info("Using Kafka brokers: {$brokers}");

            $kafkaConsumer = Kafka::consumer(
                topics: [config('kafka.topics.product_events')],
                groupId: 'product-elasticsearch-group',
                brokers: $brokers
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
