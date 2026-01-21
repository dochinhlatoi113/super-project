<?php
/**
 * Class ProductVariantAlbumsServiceProvider
 *
 * Service provider for registering services and bindings
 * Handles dependency injection and service registration
 */namespace App\Domain\ProductVariantAlbums\Providers;
use Illuminate\Support\ServiceProvider;
use App\Domain\ProductVariantAlbums\Repositories\ProductVariantAlbumsRepositoryInterface;
use App\Domain\ProductVariantAlbums\Repositories\ProductVariantAlbumsRepository;

class ProductVariantAlbumsServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ProductVariantAlbumsRepositoryInterface::class, ProductVariantAlbumsRepository::class);
    }

    public function boot()
    {
        \App\Domain\ProductVariantAlbums\Entities\ProductVariantAlbums::observe(\App\Domain\ProductVariantAlbums\Observers\ProductVariantAlbumsObserver::class);
    }
}
