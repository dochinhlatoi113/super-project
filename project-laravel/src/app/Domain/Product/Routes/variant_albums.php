<?php
use Illuminate\Support\Facades\Route;
use App\Domain\ProductVariantAlbums\Http\Controllers\ProductVariantAlbumsController;
Route::apiResource('product_variant_albums', ProductVariantAlbumsController::class);
