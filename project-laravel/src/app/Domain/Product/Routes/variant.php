<?php
use Illuminate\Support\Facades\Route;
use App\Domain\ProductVariant\Http\Controllers\ProductVariantController;
Route::apiResource('product_variants', ProductVariantController::class);
