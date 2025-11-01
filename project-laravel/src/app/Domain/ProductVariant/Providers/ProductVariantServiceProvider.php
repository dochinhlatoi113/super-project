<?php
namespace App\Domain\ProductVariant\Providers;
use Illuminate\Support\ServiceProvider;
use App\Domain\ProductVariant\Repositories\ProductVariantRepositoryInterface;
use App\Domain\ProductVariant\Repositories\ProductVariantRepository;

class ProductVariantServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ProductVariantRepositoryInterface::class, ProductVariantRepository::class);
    }

    public function boot()
    {
        \App\Domain\ProductVariant\Entities\ProductVariant::observe(\App\Domain\ProductVariant\Observers\ProductVariantObserver::class);
    }
}
