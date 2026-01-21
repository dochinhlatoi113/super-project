<?php
/**
 * Class ClearProductCacheCommand
 *
 * Console command for CLI operations
 * Provides command-line interface functionality
 */
namespace App\Domain\Product\Console\Commands;

use Illuminate\Console\Command;
use App\Domain\Product\Contracts\ProductCacheInterface;

class ClearProductCacheCommand extends Command
{
    protected $signature = 'product:clear-cache';
    protected $description = 'Clear all product cache from Redis';

    protected ProductCacheInterface $cache;

    public function __construct(ProductCacheInterface $cache)
    {
        parent::__construct();
        $this->cache = $cache;
    }

    public function handle()
    {
        $this->info('Clearing product cache...');

        try {
            $this->cache->flush();
            $this->info('Product cache cleared successfully!');
            return 0;
        } catch (\Exception $e) {
            $this->error('Failed to clear product cache: ' . $e->getMessage());
            return 1;
        }
    }
}
