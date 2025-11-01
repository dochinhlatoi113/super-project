<?php

namespace App\Domain\Product\Console\Commands;

use App\Domain\Product\Services\Elasticsearch\ProductElasticsearchService;
use Illuminate\Console\Command;

class InitElasticsearchIndex extends Command
{
    protected $signature = 'product:es-init';
    protected $description = 'Initialize Elasticsearch index for products';

    public function handle(ProductElasticsearchService $esService): int
    {
        $this->info('Creating Elasticsearch index...');

        if ($esService->createIndex()) {
            $this->info('✓ Index created successfully!');
            return self::SUCCESS;
        }

        $this->error('✗ Failed to create index');
        return self::FAILURE;
    }
}
