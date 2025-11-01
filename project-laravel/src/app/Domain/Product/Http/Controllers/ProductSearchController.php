<?php

namespace App\Domain\Product\Http\Controllers;

use App\Domain\Product\Services\Elasticsearch\ProductElasticsearchService;
use App\Domain\Helpers\BaseApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ProductSearchController
{
    use BaseApiResponse;

    protected ProductElasticsearchService $esService;

    public function __construct(ProductElasticsearchService $esService)
    {
        $this->esService = $esService;
    }

    /**
     * Search products with text query and filters
     * 
     * GET /api/v1/products/search?q=laptop&brand_name=HP&category_name=Laptop&color=red&price_min=100&price_max=1000
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = (string)$request->get('q', '');
            $size = min($request->get('size', 10), 100); // Max 100 results per page
            $page = max($request->get('page', 1), 1);
            $from = ($page - 1) * $size;

            // Build filters
            $filters = [];

            // Filter by brand (ID, name, or slug)
            if ($request->has('brand_id')) {
                $filters['brand_id'] = (int)$request->get('brand_id');
            }
            if ($request->has('brand_name')) {
                $filters['brand_name'] = (string)$request->get('brand_name');
            }
            if ($request->has('brand_slug')) {
                $filters['brand_slug'] = (string)$request->get('brand_slug');
            }

            // Filter by category (ID, name, or slug)
            if ($request->has('category_id')) {
                $filters['category_id'] = (int)$request->get('category_id');
            }
            if ($request->has('category_name')) {
                $filters['category_name'] = (string)$request->get('category_name');
            }
            if ($request->has('category_slug')) {
                $filters['category_slug'] = (string)$request->get('category_slug');
            }

            // Filter by slug (exact match)
            if ($request->has('slug')) {
                $filters['slug'] = (string)$request->get('slug');
            }

            // Default to active products only (exclude soft deleted)
            if (!isset($filters['is_active'])) {
                $filters['is_active'] = true;
            }

            // Price range filter (on variants.price, not config)
            if ($request->has('price_min')) {
                $filters['price_min'] = (float)$request->get('price_min');
            }
            if ($request->has('price_max')) {
                $filters['price_max'] = (float)$request->get('price_max');
            }

            // Build variant config filters (color, size, storage from variants.config)
            $configFilters = [];

            if ($request->has('color')) {
                $configFilters['color'] = (string)$request->get('color');
            }
            if ($request->has('variant_size')) {
                $configFilters['size'] = (string)$request->get('variant_size');
            }
            if ($request->has('storage')) {
                $configFilters['storage'] = (int)$request->get('storage');
            }

            // Use combined search if config filters exist, otherwise use simple search
            if (!empty($configFilters)) {
                $result = $this->esService->searchWithVariantConfig($query, $filters, $configFilters, $size, $from);
            } else {
                $result = $this->esService->search($query, $filters, $size, $from);
            }

            // Filter variants and configs by price range + config filters in response
            if (isset($filters['price_min']) || isset($filters['price_max']) || !empty($configFilters)) {
                $priceMin = $filters['price_min'] ?? null;
                $priceMax = $filters['price_max'] ?? null;

                foreach ($result['products'] as &$product) {
                    if (isset($product['variants']) && is_array($product['variants'])) {
                        // Filter each variant
                        foreach ($product['variants'] as &$variant) {
                            if (isset($variant['config']) && is_array($variant['config'])) {
                                // Filter configs within variant
                                $variant['config'] = array_values(array_filter($variant['config'], function ($config) use ($priceMin, $priceMax, $configFilters) {
                                    // Check price range
                                    if ($priceMin !== null && ($config['price'] ?? 0) < $priceMin) {
                                        return false;
                                    }
                                    if ($priceMax !== null && ($config['price'] ?? 0) > $priceMax) {
                                        return false;
                                    }

                                    // Check color
                                    if (isset($configFilters['color']) && ($config['color'] ?? null) !== $configFilters['color']) {
                                        return false;
                                    }

                                    // Check size
                                    if (isset($configFilters['size']) && ($config['size'] ?? null) !== $configFilters['size']) {
                                        return false;
                                    }

                                    // Check storage
                                    if (isset($configFilters['storage']) && ($config['storage'] ?? null) != $configFilters['storage']) {
                                        return false;
                                    }

                                    return true;
                                }));
                            }
                        }
                        unset($variant); // Break reference

                        // Remove variants with no matching configs
                        $product['variants'] = array_values(array_filter($product['variants'], function ($variant) {
                            return !empty($variant['config']);
                        }));
                    }
                }
                unset($product); // Break reference
            }

            Log::channel('elasticsearch')->info("[API] Product search executed", [
                'query' => $query,
                'filters' => $filters,
                'config_filters' => $configFilters,
                'total' => $result['total'],
                'size' => $size,
                'page' => $page
            ]);

            return $this->successResponse([
                'products' => $result['products'],
                'total' => $result['total'],
                'size' => $size,
                'page' => $page,
                'total_pages' => ceil($result['total'] / $size)
            ], 'Products retrieved successfully');
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[API] Product search failed", [
                'query' => $request->get('q', ''),
                'error' => $e->getMessage()
            ]);

            return $this->serverErrorResponse('Search failed', config('app.debug') ? $e->getMessage() : null);
        }
    }

    /**
     * Get product by ID from Elasticsearch
     * 
     * GET /api/v1/products/{id}/search
     */
    public function show(int $id): JsonResponse
    {
        try {
            // Search for specific product ID - only active products
            $result = $this->esService->search('', ['id' => $id, 'is_active' => true], 1, 0);

            if (empty($result['products'])) {
                return $this->notFoundResponse('Product not found in search index');
            }

            Log::channel('elasticsearch')->info("[API] Product retrieved from ES", [
                'product_id' => $id
            ]);

            return $this->successResponse($result['products'][0], 'Product retrieved successfully');
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[API] Product show failed", [
                'product_id' => $id,
                'error' => $e->getMessage()
            ]);

            return $this->serverErrorResponse('Failed to retrieve product', config('app.debug') ? $e->getMessage() : null);
        }
    }

    /**
     * Health check for Elasticsearch
     * 
     * GET /api/v1/products/search/health
     */
    public function health(): JsonResponse
    {
        try {
            // Try a simple search to check ES health
            $result = $this->esService->search('', [], 1, 0);

            return $this->successResponse([
                'total_products' => $result['total']
            ], 'Elasticsearch is healthy');
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[API] ES health check failed", [
                'error' => $e->getMessage()
            ]);

            return $this->errorResponse('Elasticsearch is not healthy', 503, config('app.debug') ? $e->getMessage() : null);
        }
    }

    /**
     * Search products by variant config
     * 
     * GET /api/v1/products/search/config?color=red&size=14%20inch&brand_id=1
     */
    public function searchByConfig(Request $request): JsonResponse
    {
        try {
            $size = min($request->get('size', 10), 100);
            $page = max($request->get('page', 1), 1);
            $from = ($page - 1) * $size;

            // Extract config filters
            $configFilters = [];
            $allowedConfigFields = ['color', 'size'];

            foreach ($allowedConfigFields as $field) {
                if ($request->has($field)) {
                    $configFilters[$field] = $request->get($field);
                }
            }

            if (empty($configFilters)) {
                return $this->errorResponse('At least one config filter is required (color, size)', 400);
            }

            // Build regular filters
            $filters = [];
            if ($request->has('brand_id')) {
                $filters['brand_id'] = (int)$request->get('brand_id');
            }
            if ($request->has('category_id')) {
                $filters['category_id'] = (int)$request->get('category_id');
            }

            // Default to active products only (exclude soft deleted)
            if (!isset($filters['is_active'])) {
                $filters['is_active'] = true;
            }

            $result = $this->esService->searchByVariantConfig($configFilters, $filters, $size, $from);

            Log::channel('elasticsearch')->info("[API] Variant config search executed", [
                'config_filters' => $configFilters,
                'filters' => $filters,
                'total' => $result['total'],
                'size' => $size,
                'page' => $page
            ]);

            return $this->successResponse([
                'products' => $result['products'],
                'total' => $result['total'],
                'size' => $size,
                'page' => $page,
                'total_pages' => ceil($result['total'] / $size),
                'filters' => [
                    'config' => $configFilters,
                    'product' => $filters
                ]
            ], 'Products retrieved successfully');
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[API] Variant config search failed", [
                'request' => $request->all(),
                'error' => $e->getMessage()
            ]);

            return $this->serverErrorResponse('Variant config search failed', config('app.debug') ? $e->getMessage() : null);
        }
    }
}
