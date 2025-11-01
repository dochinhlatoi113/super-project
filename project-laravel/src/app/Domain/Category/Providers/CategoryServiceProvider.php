<?php

namespace App\Domain\Category\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Category\Repositories\CategoryRepositoryInterface;
use App\Domain\Category\Repositories\CategoryRepository;

class CategoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
    }

    public function boot(): void
    {
        // Đăng ký observer
        \App\Domain\Category\Entities\Category::observe(
            \App\Domain\Category\Observers\CategoryObserver::class
        );
    }
}
