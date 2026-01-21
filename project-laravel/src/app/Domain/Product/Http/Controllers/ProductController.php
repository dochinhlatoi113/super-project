<?php
/**
 * Class ProductController
 *
 * Controller for handling API endpoints
 * Provides REST API operations
 */
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
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "StoreProductRequest",
    required: ["name", "slug"],
    properties: [
        new OA\Property(property: "name", type: "string", example: "iPhone 15 Pro"),
        new OA\Property(property: "slug", type: "string", example: "iphone-15-pro"),
        new OA\Property(property: "description", type: "string", example: "Latest iPhone model"),
        new OA\Property(property: "price", type: "number", example: 999.99),
        new OA\Property(property: "category_id", type: "integer", example: 1),
        new OA\Property(property: "brand_id", type: "integer", example: 1)
    ]
)]
#[OA\Schema(
    schema: "UpdateProductRequest",
    properties: [
        new OA\Property(property: "name", type: "string", example: "iPhone 15 Pro"),
        new OA\Property(property: "slug", type: "string", example: "iphone-15-pro"),
        new OA\Property(property: "description", type: "string", example: "Latest iPhone model"),
        new OA\Property(property: "price", type: "number", example: 999.99),
        new OA\Property(property: "category_id", type: "integer", example: 1),
        new OA\Property(property: "brand_id", type: "integer", example: 1)
    ]
)]
class ProductController extends Controller
{
    use BaseApiResponse;

    protected $service;
    protected ProductCacheService $cacheService;
    protected ProductRedisCache $redisCache;

    /**
     * ProductController constructor.
     *
     * @param mixed $service Service instance for business logic
     */    public function __construct(ProductService $service, ProductCacheService $cacheService, ProductRedisCache $redisCache)
    {
        $this->service = $service;
        $this->cacheService = $cacheService;
        $this->redisCache = $redisCache;
    }

    #[OA\Get(
        path: "/api/v1/products",
        summary: "Get list of products",
        tags: ["Products"],
        responses: [
            new OA\Response(response: 200, description: "Products retrieved successfully")
        ]
    )]
    /**
     * Get paginated list of items
     *
     * @return \Illuminate\Http\JsonResponse Response containing paginated data
     */    public function index()
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

    #[OA\Post(
        path: "/api/v1/products",
        summary: "Create a new product",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/StoreProductRequest")
        ),
        tags: ["Products"],
        responses: [
            new OA\Response(response: 201, description: "Product created successfully"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    /**
     * Create a new item
     *
     * @param mixed $request Request object containing validated data
     * @return \Illuminate\Http\JsonResponse Response containing created item
     */    public function store(StoreProductRequest $request)
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

    #[OA\Get(
        path: "/api/v1/products/{slug}",
        summary: "Get a product by slug",
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Product retrieved successfully"),
            new OA\Response(response: 404, description: "Product not found")
        ]
    )]
    /**
     * Get a specific item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing item data
     */    public function show(string $slug)
    {
        $product = $this->service->findBySlug($slug);
        if (!$product) {
            return $this->notFoundResponse('Product not found');
        }

        return $this->successResponse($product, 'Product retrieved successfully');
    }

    #[OA\Put(
        path: "/api/v1/products/{slug}",
        summary: "Update a product",
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: "#/components/schemas/UpdateProductRequest")
        ),
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Product updated successfully"),
            new OA\Response(response: 404, description: "Product not found"),
            new OA\Response(response: 422, description: "Validation error")
        ]
    )]
    /**
     * Update an existing item
     *
     * @param mixed $request Request object containing validated data
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response containing updated item
     */    public function update(UpdateProductRequest $request, string $slug)
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

    #[OA\Delete(
        path: "/api/v1/products/{slug}",
        summary: "Delete a product",
        tags: ["Products"],
        parameters: [
            new OA\Parameter(
                name: "slug",
                in: "path",
                required: true,
                schema: new OA\Schema(type: "string")
            )
        ],
        responses: [
            new OA\Response(response: 200, description: "Product deleted successfully"),
            new OA\Response(response: 404, description: "Product not found")
        ]
    )]
    /**
     * Delete an item by identifier
     *
     * @param string $id Item identifier
     * @return \Illuminate\Http\JsonResponse Response indicating deletion result
     */    public function destroy(string $slug)
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

    #[OA\Post(
        path: "/api/v1/products/clear-cache",
        summary: "Clear all product cache",
        tags: ["Products"],
        responses: [
            new OA\Response(response: 200, description: "Product cache cleared successfully")
        ]
    )]
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
