<?php

namespace App\Domain\Product\Contracts;

interface ProductCacheInterface
{
    /**
     * Get products from cache by page number
     */
    public function getPage(int $page, int $perPage = 20): ?array;

    /**
     * Cache products page
     */
    public function cachePage(int $page, array $products, int $perPage = 20): void;

    /**
     * Remove page from cache
     */
    public function removePage(int $page): void;

    /**
     * Get the page number for a product by its ID
     */
    public function getProductPage(int $productId, int $perPage = 20): ?int;

    /**
     * Clear all product cache
     */
    public function flush(): void;
}
