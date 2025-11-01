<?php

namespace App\Domain\Product\Services;

use App\Domain\Product\Repositories\ProductRepositoryInterface;
use App\Domain\ProductVariant\Services\ProductVariantService;
use App\Domain\ProductVariantAlbums\Services\ProductVariantAlbumsService;
use App\Domain\ProductSku\Services\ProductSkuService;
use App\Domain\Product\Contracts\ProductCacheInterface;
use App\Domain\Product\Services\Kafka\ProductEventProducer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ProductService
{
    protected ProductRepositoryInterface $repo;
    protected ProductVariantService $variantService;
    protected ProductVariantAlbumsService $albumService;
    protected ProductSkuService $skuService;
    protected ProductCacheInterface $cache;
    protected ProductEventProducer $eventProducer;

    public function __construct(
        ProductRepositoryInterface $repo,
        ProductVariantService $variantService,
        ProductVariantAlbumsService $albumService,
        ProductSkuService $skuService,
        ProductCacheInterface $cache,
        ProductEventProducer $eventProducer
    ) {
        $this->repo = $repo;
        $this->variantService = $variantService;
        $this->albumService = $albumService;
        $this->skuService = $skuService;
        $this->cache = $cache;
        $this->eventProducer = $eventProducer;
    }

    public function list(int $perPage = 15)
    {
        $page = request()->get('page', 1);
        $cachedProducts = $this->cache->getPage($page, $perPage);

        if ($cachedProducts !== null) {
            return $cachedProducts;
        }

        $products = $this->repo->paginate($perPage);
        $this->cache->cachePage($page, $products->items(), $perPage);

        return $products;
    }

    public function findBySlug(string $slug)
    {
        $product = $this->repo->findBySlug($slug);

        if ($product) {
            $product->load(['variants.albums', 'variants.primarySku', 'brand', 'categories']);
        }

        return $product;
    }

    public function create(array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';

        // DB transaction - rollback if product/variant/album fails
        $result = DB::transaction(function () use ($data) {
            try {
                // Create product
                $product = $this->repo->create($data['product']);

                // Attach categories if provided
                if (isset($data['categories']) && is_array($data['categories'])) {
                    $categoriesData = [];
                    foreach ($data['categories'] as $category) {
                        $categoriesData[$category['id']] = [
                            'is_primary' => $category['is_primary'] ?? false,
                            'is_active' => $category['is_active'] ?? true,
                        ];
                    }
                    $product->categories()->attach($categoriesData);
                }

                // Create product variant
                $variant = null;
                if (isset($data['product_variant'])) {
                    $variantData = array_merge($data['product_variant'], [
                        'product_id' => $product->id,
                    ]);
                    $variant = $this->variantService->create($variantData);
                }

                // Create variant albums
                $albums = null;
                if (!empty($variant)) {
                    $albums = $this->albumService->create($variant);
                }

                // Create SKU for variant
                $skus = null;
                if (!empty($variant) && isset($variant['product_variant_id'])) {
                    $skus = [];

                    // Handle SKU array
                    if (isset($data['product_variant']['sku']) && is_array($data['product_variant']['sku'])) {
                        foreach ($data['product_variant']['sku'] as $skuData) {
                            $skuData['product_variant_id'] = $variant['product_variant_id'];
                            $skus[] = $this->skuService->create($skuData);
                        }
                    }

                    // Handle barcode array
                    if (isset($data['product_variant']['barcode']) && is_array($data['product_variant']['barcode'])) {
                        foreach ($data['product_variant']['barcode'] as $barcodeData) {
                            $barcodeData['product_variant_id'] = $variant['product_variant_id'];
                            $skus[] = $this->skuService->create($barcodeData);
                        }
                    }

                    // Fallback: Create single SKU if no arrays provided (backward compatibility)
                    if (empty($skus) && (isset($data['product_variant']['sku']) || isset($data['product_variant']['barcode']))) {
                        $skuData = [
                            'product_variant_id' => $variant['product_variant_id'],
                            'is_primary' => true,
                            'type' => 'sku'
                        ];

                        if (isset($data['product_variant']['sku'])) {
                            $skuData['sku'] = $data['product_variant']['sku'];
                        }
                        if (isset($data['product_variant']['barcode'])) {
                            $skuData['barcode'] = $data['product_variant']['barcode'];
                            $skuData['type'] = 'ean';
                        }

                        $skus = $this->skuService->create($skuData);
                    }
                }

                Log::channel('product')->info('Saved product successfully', [
                    'product_id' => $product->id,
                ]);

                return [
                    'product' => $product,
                    'variant' => $variant,
                    'albums' => $albums,
                    'skus' => $skus,
                ];
            } catch (Exception $e) {
                Log::error('ProductService::create failed', [
                    'message' => $e->getMessage(),
                    // 'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        });

        // Publish Kafka event AFTER transaction success
        // If Kafka fails, product is still saved in DB (can reindex later)
        $kafkaSuccess = false;
        try {
            $result['product']->load(['brand', 'categories', 'variants']);
            $this->eventProducer->publishEvent('created', $result['product']->toArray());
            $kafkaSuccess = true;
        } catch (Exception $e) {
            Log::channel('kafka')->warning('Kafka publish failed after product creation', [
                'product_id' => $result['product']->id,
                'error' => $e->getMessage(),
            ]);
            // Don't throw - product is already saved
        }

        // Clear cache ONLY if Kafka publish was successful
        if ($kafkaSuccess) {
            try {
                $this->cache->flush();
                Log::channel('product')->info('Cache flushed after successful Kafka publish', [
                    'product_id' => $result['product']->id,
                    'action' => 'created'
                ]);
            } catch (Exception $e) {
                Log::warning('Cache clear failed after product creation', [
                    'product_id' => $result['product']->id,
                    'error' => $e->getMessage(),
                ]);
                // Don't throw - product is already saved
            }
        } else {
            Log::channel('product')->warning('Cache NOT flushed due to Kafka publish failure', [
                'product_id' => $result['product']->id,
                'action' => 'created'
            ]);
        }

        return $result;
    }

    public function update(string $slug, array $data)
    {
        // DB transaction - rollback if product/variant/album fails
        $result = DB::transaction(function () use ($slug, $data) {
            try {
                $product = $this->repo->updateBySlug($slug, $data['product']);

                // Sync categories if provided
                if (isset($data['categories']) && is_array($data['categories'])) {
                    $categoriesData = [];
                    foreach ($data['categories'] as $category) {
                        $categoriesData[$category['id']] = [
                            'is_primary' => $category['is_primary'] ?? false,
                            'is_active' => $category['is_active'] ?? true,
                        ];
                    }
                    $product->categories()->sync($categoriesData);
                }

                $variant = null;
                if (isset($data['product_variant'])) {
                    $existingVariant = $product->variants()->first();

                    $variantData = array_merge($data['product_variant'], [
                        'product_id' => $product->id,
                    ]);

                    if ($existingVariant) {
                        $variant = $this->variantService->update($existingVariant->id, $variantData);
                    } else {
                        $variant = $this->variantService->create($variantData);
                    }

                    // Handle SKU/Barcode update for existing variant
                    if ($existingVariant && (isset($data['product_variant']['sku']) || isset($data['product_variant']['barcode']))) {
                        $existingSku = $existingVariant->primarySku;

                        if ($existingSku) {
                            $skuUpdateData = [];

                            if (isset($data['product_variant']['sku'])) {
                                $skuUpdateData['sku'] = $data['product_variant']['sku'];
                            }

                            if (isset($data['product_variant']['barcode'])) {
                                $skuUpdateData['barcode'] = $data['product_variant']['barcode'];
                                $skuUpdateData['type'] = 'ean'; // Assume barcode is EAN
                            }

                            if (!empty($skuUpdateData)) {
                                $this->skuService->update($existingSku->id, $skuUpdateData);
                            }
                        } elseif (isset($data['product_variant']['sku']) || isset($data['product_variant']['barcode'])) {
                            // Create new SKU if variant exists but no primary SKU
                            $skuData = [
                                'product_variant_id' => $existingVariant->id,
                                'is_primary' => true,
                                'type' => isset($data['product_variant']['barcode']) ? 'ean' : 'sku'
                            ];

                            if (isset($data['product_variant']['sku'])) {
                                $skuData['sku'] = $data['product_variant']['sku'];
                            }

                            if (isset($data['product_variant']['barcode'])) {
                                $skuData['barcode'] = $data['product_variant']['barcode'];
                            }

                            $this->skuService->create($skuData);
                        }
                    }
                }

                $albums = null;
                if (!empty($variant) && !empty($data['product_variant']['config'])) {
                    $existingAlbums = $variant->albums;
                    if ($existingAlbums) {
                        foreach ($existingAlbums as $album) {
                            $this->albumService->delete($album->id);
                        }
                    }
                    $albums = $this->albumService->create($variant);
                }

                return [
                    'product' => $product,
                    'variant' => $variant,
                    'albums' => $albums,
                ];
            } catch (Exception $e) {
                Log::error('ProductService::update failed', [
                    'message' => $e->getMessage(),
                    // 'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        });

        // Publish Kafka event AFTER transaction success
        // If Kafka fails, product is still updated in DB (can reindex later)
        $kafkaSuccess = false;
        try {
            $result['product']->load(['brand', 'categories', 'variants']);
            $this->eventProducer->publishEvent('updated', $result['product']->toArray());
            $kafkaSuccess = true;
        } catch (Exception $e) {
            Log::channel('kafka')->warning('Kafka publish failed after product update', [
                'product_id' => $result['product']->id,
                'error' => $e->getMessage(),
            ]);
            // Don't throw - product is already updated
        }

        // Clear cache ONLY if Kafka publish was successful
        if ($kafkaSuccess) {
            try {
                $this->cache->flush();
                Log::channel('product')->info('Cache flushed after successful Kafka publish', [
                    'product_id' => $result['product']->id,
                    'action' => 'updated'
                ]);
            } catch (Exception $e) {
                Log::warning('Cache clear failed after product update', [
                    'product_id' => $result['product']->id,
                    'error' => $e->getMessage(),
                ]);
                throw $e;  // ← Throw exception để trigger DLQ
            }
        } else {
            Log::channel('product')->warning('Cache NOT flushed due to Kafka publish failure', [
                'product_id' => $result['product']->id,
                'action' => 'updated'
            ]);
        }

        return $result;
    }

    public function delete(string $slug): bool
    {
        // Get product data before deletion for Kafka event
        $product = $this->repo->findBySlug($slug);
        if (!$product) {
            throw new Exception('Product not found');
        }
        $productData = $product->toArray();

        // DB transaction - rollback if deletion fails
        $result = DB::transaction(function () use ($slug, $product) {
            try {
                $variant = $product->variants()->first();
                if ($variant) {
                    $albums = $variant->albums;
                    if ($albums) {
                        foreach ($albums as $album) {
                            $this->albumService->delete($album->id);
                        }
                    }
                    $this->variantService->delete($variant->id);
                }

                return $this->repo->deleteBySlug($slug);
            } catch (Exception $e) {
                Log::error('ProductService::delete failed', [
                    'message' => $e->getMessage(),
                    // 'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        });

        // Publish Kafka event AFTER transaction success
        // If Kafka fails, product is still deleted from DB
        $kafkaSuccess = false;
        try {
            $this->eventProducer->publishEvent('deleted', $productData);
            $kafkaSuccess = true;
        } catch (Exception $e) {
            Log::channel('kafka')->warning('Kafka publish failed after product deletion', [
                'product_slug' => $slug,
                'error' => $e->getMessage(),
            ]);
            // Don't throw - product is already deleted
        }

        // Clear cache ONLY if Kafka publish was successful
        if ($kafkaSuccess) {
            try {
                $this->cache->flush();
                Log::channel('product')->info('Cache flushed after successful Kafka publish', [
                    'product_slug' => $slug,
                    'action' => 'deleted'
                ]);
                Log::channel('kafka')->info('[Kafka Cache] Cache cleared after deleted', [
                    'action' => 'deleted',
                    'product_slug' => $slug
                ]);
            } catch (Exception $e) {
                Log::warning('Cache clear failed after product deletion', [
                    'product_slug' => $slug,
                    'error' => $e->getMessage(),
                ]);
                // Don't throw - product is already deleted
            }
        } else {
            Log::channel('product')->warning('Cache NOT flushed due to Kafka publish failure', [
                'product_slug' => $slug,
                'action' => 'deleted'
            ]);
        }

        return $result;
    }
}
