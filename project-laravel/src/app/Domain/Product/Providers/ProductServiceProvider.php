<?php
/**
 * Class ProductServiceProvider
 *
 * Service provider for registering services and bindings
 * Handles dependency injection and service registration
 */
namespace App\Domain\Product\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Domain\Product\Repositories\ProductRepository;
use App\Domain\Product\Contracts\ProductCacheInterface;
use App\Domain\Product\Services\Cache\ProductRedisCache;
use App\Domain\Product\Services\Kafka\ProductDlqProducer;
use App\Domain\Product\Services\Kafka\ProductEventProducer;

class ProductServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(ProductCacheInterface::class, ProductRedisCache::class);

        // Register Kafka Producer as singleton
        $this->app->singleton(ProductEventProducer::class, function ($app) {
            return new ProductEventProducer();
        });

        // Register DLQ Producer as singleton
        $this->app->singleton(ProductDlqProducer::class, function ($app) {
            return new ProductDlqProducer();
        });
    }

    public function boot()
    {
        // Register commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Domain\Product\Console\Commands\ClearProductCacheCommand::class,
                \App\Domain\Product\Console\Commands\ConsumeProductAudit::class,
                \App\Domain\Product\Console\Commands\ConsumeProductCache::class,
                \App\Domain\Product\Console\Commands\ConsumeProductElasticsearch::class,
                \App\Domain\Product\Console\Commands\ConsumeProductDlq::class,
                \App\Domain\Product\Console\Commands\CreateProductEventsTopic::class,
                \App\Domain\Product\Console\Commands\InitElasticsearchIndex::class,
                \App\Domain\Product\Console\Commands\ReindexProducts::class,
            ]);
        }
    }
}
