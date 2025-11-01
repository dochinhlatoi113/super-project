<?php

namespace App\Domain\Brand\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Brand\Repositories\BrandRepositoryInterface;
use App\Domain\Brand\Repositories\BrandRepository;

class BrandServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(BrandRepositoryInterface::class, BrandRepository::class);
    }

    public function boot(): void
    {
        // Đăng ký observer
        \App\Domain\Brand\Entities\Brand::observe(
            \App\Domain\Brand\Observers\BrandObserver::class
        );
    }
}
