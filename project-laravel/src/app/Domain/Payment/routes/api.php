<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Payment\Http\Controllers\PaymentController;

Route::prefix('payments')->group(function () {
    Route::get('/', [PaymentController::class, 'index']);
    Route::post('/', [PaymentController::class, 'store']);

    // CRUD routes with /detail/ prefix to avoid conflicts
    // Example: GET /api/v1/payments/detail/some-slug
    Route::get('detail/{slug}', [PaymentController::class, 'show'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::put('detail/{slug}', [PaymentController::class, 'update'])->where('slug', '[a-zA-Z0-9\-]+');
    Route::delete('detail/{slug}', [PaymentController::class, 'destroy'])->where('slug', '[a-zA-Z0-9\-]+');

    // VNPAY payment routes
    Route::post('/vnpay', [PaymentController::class, 'createVnpayPayment']);
    Route::get('/vnpay/return', [PaymentController::class, 'vnpayReturn']);
});
