<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Brand\Http\Controllers\BrandController;

Route::prefix('brands')->group(function () {
    Route::get('/', [BrandController::class, 'index']);
    Route::post('/', [BrandController::class, 'store']);

    // CRUD routes with /detail/ prefix
    // Example: GET /api/v1/brands/detail/apple
    Route::get('detail/{slug}', [BrandController::class, 'show'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::put('detail/{slug}', [BrandController::class, 'update'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::delete('detail/{slug}', [BrandController::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-]+');
});
