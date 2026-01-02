<?php

namespace App\Domain\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Product\Services\ProductService;
use App\Domain\Product\Http\Requests\StoreProductRequest;
use App\Domain\Product\Http\Requests\UpdateProductRequest;
use App\Domain\Product\Services\ProductCacheService;
use App\Domain\Product\Services\Cache\ProductRedisCache;
use App\Domain\Helpers\BaseApiResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class ProductController extends Controller
{
    use BaseApiResponse;

    protected $service;
    protected ProductCacheService $cacheService;
    protected ProductRedisCache $redisCache;

    public function __construct(ProductService $service, ProductCacheService $cacheService, ProductRedisCache $redisCache)
    {
        $this->service = $service;
        $this->cacheService = $cacheService;
        $this->redisCache = $redisCache;
    }

    public function index()
    {
        try {
            $pingRedis = Redis::connection()->ping();
            if ($pingRedis) {
                Log::channel('redis')->info('Redis is alive. Load Product Redis cache ...');
                Log::channel('product')->info('starting controller product ...');
                $products = $this->cacheService->getProducts();
            } else {
                Log::channel('redis')->error('Load Product Redis cache failed, fallback to DB', []);
                Log::channel('product')->info('starting controller product ...');
                $products = $this->service->list();
            }

            return $this->paginatedResponse($products, 'Products retrieved successfully');
        } catch (\Throwable $e) {
            // Also log Redis connection failures to the redis channel so Filebeat sends them
            try {
                Log::channel('redis')->error('Redis connection error in ProductController::index(): ' . $e->getMessage(), [
                    'error' => $e->getMessage(),
                ]);
            } catch (\Throwable $__redisLogEx) {
                // ignore logging failures
            }
            // Log to Product domain logs
            Log::channel('product')->error('Failed to retrieve products in ProductController::index()', [
                'error' => $e->getMessage(),
            ]);

            return $this->serverErrorResponse(
                'Failed to retrieve products',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                ] : null
            );
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->service->create($request->validated());
            // if ($product) {
            //     $this->redisCache->flush();
            // }
            return $this->createdResponse($product, 'Product created successfully');
        } catch (\Throwable $e) {
            // Log to Product domain logs
            Log::channel('product')->error('Failed to create product in ProductController::store()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                //'line' => $e->getLine(),
                //'trace' => $e->getTraceAsString()
            ]);

            return $this->serverErrorResponse(
                'Failed to create product',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    //'file' => $e->getFile(),
                    //'line' => $e->getLine(),
                ] : null
            );
        }
    }

    public function show(string $slug)
    {
        $product = $this->service->findBySlug($slug);
        if (!$product) {
            return $this->notFoundResponse('Product not found');
        }

        return $this->successResponse($product, 'Product retrieved successfully');
    }

    public function update(UpdateProductRequest $request, string $slug)
    {
        try {
            $product = $this->service->update($slug, $request->validated());
            // if ($product) {
            //     $this->redisCache->flush();
            // }
            return $this->successResponse($product, 'Product updated successfully');
        } catch (\Throwable $e) {
            // Log to Product domain logs
            Log::channel('product')->error('Failed to update product in ProductController::update()', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                //'line' => $e->getLine(),
                //'trace' => $e->getTraceAsString()
            ]);

            if (str_contains($e->getMessage(), 'not found')) {
                return $this->notFoundResponse('Product not found');
            }

            return $this->serverErrorResponse(
                'Failed to update product',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    //'file' => $e->getFile(),
                    //'line' => $e->getLine(),
                ] : null
            );
        }
    }

    public function destroy(string $slug)
    {
        try {
            $this->service->delete($slug);
            // if ($delete) {
            //     $this->redisCache->flush();
            // }
            return $this->deletedResponse('Product deleted successfully');
        } catch (\Throwable $e) {
            // Log to Product domain logs
            Log::channel('product')->error('Failed to delete product in ProductController::destroy()', [
                'slug' => $slug,
                'error' => $e->getMessage(),
                //'file' => $e->getFile(),
                //'line' => $e->getLine(),
                //'trace' => $e->getTraceAsString()
            ]);

            if (str_contains($e->getMessage(), 'not found')) {
                return $this->notFoundResponse('Product not found');
            }

            return $this->serverErrorResponse(
                'Failed to delete product',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    //'file' => $e->getFile(),
                    //'line' => $e->getLine(),
                ] : null
            );
        }
    }

    public function clearCacheAllPageProduct()
    {
        try {
            $this->redisCache->flush();
            return $this->successResponse(null, 'Product cache cleared successfully');
        } catch (\Throwable $e) {
            // Log to Product domain logs
            Log::channel('product')->error('Failed to clear product cache in ProductController::clearCacheAllPageProduct()', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // 'trace' => $e->getTraceAsString()
            ]);

            return $this->serverErrorResponse(
                'Failed to clear cache',
                config('app.debug') ? [
                    'message' => $e->getMessage(),
                    //'file' => $e->getFile(),
                    //'line' => $e->getLine(),
                ] : null
            );
        }
    }
}
