<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Category\Http\Controllers\CategoryController;

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);

    // CRUD routes with /detail/ prefix
    // Example: GET /api/v1/categories/detail/electronics
    Route::get('detail/{slug}', [CategoryController::class, 'show'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::put('detail/{slug}', [CategoryController::class, 'update'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::delete('detail/{slug}', [CategoryController::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-]+');
});
