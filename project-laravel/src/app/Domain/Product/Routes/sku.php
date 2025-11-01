<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductSkuController;

// SKU Management Routes
Route::prefix('products/skus')->group(function () {
    // Get SKUs for a variant
    Route::get('variant/{variantId}', [ProductSkuController::class, 'getByVariant']);

    // Get primary SKU for a variant
    Route::get('variant/{variantId}/primary', [ProductSkuController::class, 'getPrimarySku']);

    // Find SKU by code
    Route::get('find/{code}', [ProductSkuController::class, 'findByCode']);

    // Create SKU
    Route::post('/', [ProductSkuController::class, 'create']);

    // Update SKU
    Route::put('/{id}', [ProductSkuController::class, 'update']);

    // Delete SKU
    Route::delete('/{id}', [ProductSkuController::class, 'delete']);

    // Set primary SKU
    Route::patch('variant/{variantId}/primary/{skuId}', [ProductSkuController::class, 'setPrimary']);
});
