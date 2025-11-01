<?php

namespace App\Domain\Product\Services\Cache;

use App\Domain\Product\Contracts\ProductCacheInterface;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class ProductRedisCache implements ProductCacheInterface
{
    private const CACHE_PREFIX = 'products:list:page:';
    private const CACHE_TTL = 3600;

    public function getPage(int $page, int $perPage = 20): ?array
    {
        try {
            $key = $this->getPageKey($page);
            $cached = Redis::get($key);
            return $cached ? json_decode($cached, true) : null;
        } catch (\Exception $e) {
            Log::error("Failed to get products page from cache", [
                'page' => $page,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    public function cachePage(int $page, array $products, int $perPage = 20): void
    {
        try {
            $key = $this->getPageKey($page);
            Redis::setex($key, self::CACHE_TTL, json_encode($products));
        } catch (\Exception $e) {
            Log::error("Failed to cache products page", [
                'page' => $page,
                'error' => $e->getMessage()
            ]);
        }
    }


    public function removePage(int $page): void
    {
        try {
            $key = $this->getPageKey($page);
            Redis::del($key);
        } catch (\Exception $e) {
            Log::error("Failed to remove products page from cache", [
                'page' => $page,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getProductPage(int $productId, int $perPage = 20): ?int
    {
        try {
            return (int) ceil($productId / $perPage);
        } catch (\Exception $e) {
            Log::error("Failed to calculate product page", [
                'product_id' => $productId,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    public function flush(): void
    {
        try {
            $prefix = config('database.redis.options.prefix', '');
            $pattern = "{$prefix}products:list:*";

            $deletedKeys = [];
            $allKeys = Redis::keys('products:list:*');

            foreach ($allKeys as $key) {
                Redis::del(str_replace($prefix, '', $key));
                $deletedKeys[] = $key;
            }
            Log::info("Cleared all product cache keys", [
                'pattern' => $pattern,
                'deleted_keys' => $deletedKeys,
                'prefix' => $prefix
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to flush products cache", [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
    private function getPageKey(int $page): string
    {
        return self::CACHE_PREFIX . $page;
    }
}
