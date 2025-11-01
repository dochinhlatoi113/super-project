<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Product\Http\Controllers\ProductSearchController;

/*
|--------------------------------------------------------------------------
| Product Search API Routes
|--------------------------------------------------------------------------
|
| Elasticsearch-powered product search routes
| Auto-loaded by routes/api.php with 'v1' prefix
|
*/

Route::group(['prefix' => 'products'], function () {

    // Health check for Elasticsearch
    Route::get('search/health', [ProductSearchController::class, 'health'])
        ->name('products.search.health');

    // Search products
    Route::get('search', [ProductSearchController::class, 'search'])
        ->name('products.search');

    // Search products by variant config (color, size, etc.)
    Route::get('search/config', [ProductSearchController::class, 'searchByConfig'])
        ->name('products.search.config');

    // Get specific product from search index
    Route::get('{id}/search', [ProductSearchController::class, 'show'])
        ->where('id', '[0-9]+')
        ->name('products.search.show');
});
