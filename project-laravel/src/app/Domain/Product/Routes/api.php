<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Product\Http\Controllers\ProductController;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::post('/', [ProductController::class, 'store']);
    Route::get('clear-cache', [ProductController::class, 'clearCacheAllPageProduct']);

    // CRUD routes with /detail/ prefix to avoid conflict with /search
    // Example: GET /api/v1/products/detail/iphone-15
    Route::get('detail/{slug}', [ProductController::class, 'show'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::put('detail/{slug}', [ProductController::class, 'update'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::delete('detail/{slug}', [ProductController::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-]+');
});
