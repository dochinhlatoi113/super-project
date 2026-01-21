<?php
/**
 * Class ProductCacheService
 *
 * Service layer for handling business logic
 * Provides CRUD operations and business rules
 */
namespace App\Domain\Product\Services;

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;
use App\Domain\Product\Repositories\ProductRepositoryInterface;

class ProductCacheService
{
    protected string $key = 'products:list';
    protected ProductRepositoryInterface $repo;

    /**
     * ProductCacheService constructor.
     *
     * @param mixed $repo Repository instance for data operations
     */    public function __construct(
        ProductRepositoryInterface $repo
    ) {
        $this->repo = $repo;
    }
    public function getProducts()
    {
        try {
            $perPage = 20;
            $redisKeyBase = "{$this->key}";
            $page = request()->get('page', 1);
            $redisKey = "{$redisKeyBase}:page:{$page}";
            if (Redis::exists($redisKey)) {
                Log::channel('logstash')->info("Redis HIT: {$redisKey}");
                $cached = Redis::get($redisKey);
                return json_decode($cached, true);
            } else {
                Log::channel('logstash')->info("Redis MISS: {$redisKey}, cached now.");
                $products = $this->repo->paginate($perPage);
                Redis::set($redisKey, json_encode($products));
            }
            return $products;
        } catch (\Throwable $th) {
            Log::channel('redis')->error('Redis cache failed', [
                'error' => $th->getMessage(),
                // 'trace' => $th->getTraceAsString()
            ]);
            return $this->repo->paginate(10000);
        }
    }

    public function clearCache()
    {
        $client = Redis::connection()->client();

        $prefix = config('database.redis.options.prefix') . "{$this->key}:";
        $keys = $client->keys($prefix . '*');

        foreach ($keys as $key) {
            $client->del($key);
        }

        Log::info('Cleared Redis cache (raw)', ['keys' => $keys]);
    }
}
