<?php

namespace App\Domain\Product\Services\Elasticsearch;

use Elastic\Elasticsearch\ClientBuilder;
use Elastic\Elasticsearch\Client;
use Illuminate\Support\Facades\Log;

class ProductElasticsearchService
{
    protected Client $client;
    protected string $index = 'products';

    public function __construct()
    {
        $hostEnv = env('ELASTICSEARCH_HOST', 'http://laravel_elasticsearch:9200');
        $user = env('ELASTICSEARCH_USER', null);
        $pass = env('ELASTICSEARCH_PASS', null);

        // Build hosts array and configure basic auth if credentials present.
        $hosts = [$hostEnv];

        $builder = ClientBuilder::create()
            ->setHosts($hosts);

        // If credentials provided, set explicit basic authentication so the client
        // sends Authorization header with requests.
        if (!empty($user) && !empty($pass)) {
            // The ClientBuilder provides setBasicAuthentication in recent clients.
            try {
                $builder->setBasicAuthentication($user, $pass);
            } catch (\Throwable $e) {
                // Fallback: if setBasicAuthentication isn't available, embed credentials
                // in the host URL as before (covers older client versions).
                $parts = parse_url($hostEnv);
                $scheme = $parts['scheme'] ?? 'http';
                $hostOnly = $parts['host'] ?? ($parts['path'] ?? $hostEnv);
                $port = isset($parts['port']) ? ':' . $parts['port'] : '';
                $hostsWithCreds = [$scheme . '://' . urlencode($user) . ':' . urlencode($pass) . '@' . $hostOnly . $port];
                $builder = ClientBuilder::create()->setHosts($hostsWithCreds);
            }
        }

        $this->client = $builder->build();
    }

    /**
     * Get Elasticsearch client
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * Create index with mapping
     */
    public function createIndex(): bool
    {
        try {
            if ($this->client->indices()->exists(['index' => $this->index])->asBool()) {
                Log::info("[ES] Index '{$this->index}' already exists");
                return true;
            }

            $this->client->indices()->create([
                'index' => $this->index,
                'body' => [
                    'settings' => [
                        'number_of_shards' => 1,
                        'number_of_replicas' => 0,
                        'analysis' => [
                            'analyzer' => [
                                'product_analyzer' => [
                                    'type' => 'custom',
                                    'tokenizer' => 'standard',
                                    'filter' => ['lowercase', 'asciifolding']
                                ]
                            ]
                        ]
                    ],
                    'mappings' => [
                        'properties' => [
                            'id' => ['type' => 'integer'],
                            'name' => [
                                'type' => 'text',
                                'analyzer' => 'product_analyzer',
                                'fields' => [
                                    'keyword' => ['type' => 'keyword']
                                ]
                            ],
                            'slug' => ['type' => 'keyword'],
                            'brand_id' => ['type' => 'integer'],
                            'brand_name' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => ['type' => 'keyword']
                                ]
                            ],
                            'brand' => [
                                'properties' => [
                                    'id' => ['type' => 'integer'],
                                    'name' => [
                                        'type' => 'text',
                                        'fields' => ['keyword' => ['type' => 'keyword']]
                                    ],
                                    'slug' => ['type' => 'keyword'],
                                    'logo' => ['type' => 'keyword'],
                                    'is_active' => ['type' => 'boolean']
                                ]
                            ],
                            'category_id' => ['type' => 'integer'],
                            'category_name' => [
                                'type' => 'text',
                                'fields' => [
                                    'keyword' => ['type' => 'keyword']
                                ]
                            ],
                            'category' => [
                                'properties' => [
                                    'id' => ['type' => 'integer'],
                                    'name' => [
                                        'type' => 'text',
                                        'fields' => ['keyword' => ['type' => 'keyword']]
                                    ],
                                    'slug' => ['type' => 'keyword'],
                                    'is_active' => ['type' => 'boolean']
                                ]
                            ],
                            'categories' => [
                                'type' => 'nested',
                                'properties' => [
                                    'id' => ['type' => 'integer'],
                                    'name' => [
                                        'type' => 'text',
                                        'fields' => ['keyword' => ['type' => 'keyword']]
                                    ],
                                    'slug' => ['type' => 'keyword'],
                                    'is_primary' => ['type' => 'boolean'],
                                    'is_active' => ['type' => 'boolean']
                                ]
                            ],
                            'is_active' => ['type' => 'boolean'],
                            'created_at' => ['type' => 'date'],
                            'updated_at' => ['type' => 'date'],
                            'variants' => [
                                'type' => 'nested',
                                'properties' => [
                                    'id' => ['type' => 'integer'],
                                    'name' => ['type' => 'text'],
                                    'price' => ['type' => 'float'],
                                    'stock' => ['type' => 'integer'],
                                    'is_active' => ['type' => 'boolean'],
                                    'config' => [
                                        'type' => 'nested',
                                        'properties' => [
                                            'color' => ['type' => 'keyword'],
                                            'size' => ['type' => 'keyword'],
                                            'price' => ['type' => 'float'],
                                            'stock' => ['type' => 'integer'],
                                            'is_active' => ['type' => 'boolean'],
                                            'income_number' => ['type' => 'integer']
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            Log::channel('elasticsearch')->info("[ES] Index '{$this->index}' created successfully");
            return true;
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Failed to create index", ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Index a product document with variants
     */
    public function indexProduct(array $productData): bool
    {
        try {
            // Prepare variants data
            $variants = [];
            if (isset($productData['variants']) && is_array($productData['variants'])) {
                foreach ($productData['variants'] as $variant) {
                    $config = [];

                    // Parse config JSON if it's a string (handle double encoding)
                    if (isset($variant['config'])) {
                        $configData = $variant['config'];

                        // If it's a string, decode it
                        if (is_string($configData)) {
                            $configData = json_decode($configData, true);
                        }

                        // If it's still a string (double encoded), decode again
                        if (is_string($configData)) {
                            $configData = json_decode($configData, true);
                        }

                        // Handle both array and object formats
                        if (is_array($configData)) {
                            // If it's array of configs, keep them as array
                            if (isset($configData[0]) && is_array($configData[0])) {
                                // Clean up data types for each config item
                                $config = array_map(function ($item) {
                                    return [
                                        'color' => $item['color'] ?? '',
                                        'size' => $item['size'] ?? '',
                                        'price' => (float)($item['price'] ?? 0),
                                        'stock' => (int)($item['stock'] ?? 0),
                                        'is_active' => filter_var($item['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN),
                                        'income_number' => (int)($item['income_number'] ?? 0)
                                    ];
                                }, $configData);
                            } else {
                                // Single config object
                                $config = [[
                                    'color' => $configData['color'] ?? '',
                                    'size' => $configData['size'] ?? '',
                                    'price' => (float)($configData['price'] ?? 0),
                                    'stock' => (int)($configData['stock'] ?? 0),
                                    'is_active' => filter_var($configData['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN),
                                    'income_number' => (int)($configData['income_number'] ?? 0)
                                ]];
                            }
                        }
                    }

                    $variants[] = [
                        'id' => $variant['id'] ?? null,
                        'name' => $variant['name'] ?? '',
                        'price' => (float)($variant['price'] ?? 0),
                        'stock' => (int)($variant['stock'] ?? 0),
                        'is_active' => (bool)($variant['is_active'] ?? true),
                        'config' => $config
                    ];
                }
            }

            $this->client->index([
                'index' => $this->index,
                'id' => $productData['id'],
                'body' => [
                    'id' => $productData['id'],
                    'name' => $productData['name'] ?? $productData['product_name'] ?? '',
                    'slug' => $productData['slug'] ?? '',
                    'brand_id' => $productData['brand_id'] ?? null,
                    'brand_name' => $productData['brand']['name'] ?? $productData['brand_name'] ?? null,
                    'brand' => isset($productData['brand']) ? [
                        'id' => $productData['brand']['id'] ?? null,
                        'name' => $productData['brand']['name'] ?? null,
                        'slug' => $productData['brand']['slug'] ?? null,
                        'logo' => $productData['brand']['logo'] ?? null,
                        'is_active' => $productData['brand']['is_active'] ?? true,
                    ] : null,
                    'category_id' => $productData['category_id'] ?? null,
                    'category_name' => $productData['category']['name'] ?? $productData['category_name'] ?? null,
                    'category' => isset($productData['category']) ? [
                        'id' => $productData['category']['id'] ?? null,
                        'name' => $productData['category']['name'] ?? null,
                        'slug' => $productData['category']['slug'] ?? null,
                        'is_active' => $productData['category']['is_active'] ?? true,
                    ] : null,
                    'categories' => isset($productData['categories']) ? array_map(function ($cat) {
                        return [
                            'id' => $cat['id'] ?? null,
                            'name' => $cat['name'] ?? null,
                            'slug' => $cat['slug'] ?? null,
                            'is_primary' => $cat['pivot']['is_primary'] ?? false,
                            'is_active' => $cat['pivot']['is_active'] ?? true,
                        ];
                    }, $productData['categories']) : [],
                    'is_active' => $productData['is_active'] ?? true,
                    'created_at' => $productData['created_at'] ?? now()->toIso8601String(),
                    'updated_at' => $productData['updated_at'] ?? now()->toIso8601String(),
                    'variants' => $variants
                ]
            ]);

            Log::channel('elasticsearch')->info("[ES] Product indexed successfully", [
                'product_id' => $productData['id']
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Failed to index product", [
                'product_id' => $productData['id'] ?? null,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Update a product document (same as index - upsert)
     */
    public function updateProduct(array $productData): bool
    {
        return $this->indexProduct($productData);
    }

    /**
     * Delete a product document (soft delete - set is_active = false)
     */
    public function deleteProduct(int $productId): bool
    {
        try {
            // Instead of deleting, update is_active to false
            $this->client->update([
                'index' => $this->index,
                'id' => $productId,
                'body' => [
                    'doc' => [
                        'is_active' => false,
                        'updated_at' => now()->toIso8601String()
                    ]
                ]
            ]);

            Log::channel('elasticsearch')->info("[ES] Product marked as inactive", [
                'product_id' => $productId
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Failed to mark product as inactive", [
                'product_id' => $productId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Search products
     */
    public function search(string $query, array $filters = [], int $size = 10, int $from = 0): array
    {
        try {
            // Build query: match_all if empty query, otherwise multi_match
            $queryPart = empty($query) || $query === '*'
                ? ['match_all' => (object)[]]
                : [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => ['name^3', 'category_name^2', 'brand_name'],
                        'type' => 'best_fields',
                        'operator' => 'or',
                        'minimum_should_match' => '50%'
                    ]
                ];

            $body = [
                'query' => [
                    'bool' => [
                        'must' => [$queryPart],
                        'filter' => []
                    ]
                ],
                'size' => $size,
                'from' => $from
            ];

            // Add filters
            if (!empty($filters['brand_id'])) {
                $body['query']['bool']['filter'][] = ['term' => ['brand_id' => $filters['brand_id']]];
            }

            // Filter by brand_name (exact match on keyword field)
            if (!empty($filters['brand_name'])) {
                $body['query']['bool']['filter'][] = ['term' => ['brand_name.keyword' => $filters['brand_name']]];
            }

            // Filter by brand_slug (exact match)
            if (!empty($filters['brand_slug'])) {
                $body['query']['bool']['filter'][] = ['term' => ['brand.slug' => $filters['brand_slug']]];
            }

            if (!empty($filters['category_id'])) {
                $body['query']['bool']['filter'][] = ['term' => ['category_id' => $filters['category_id']]];
            }

            // Filter by category_name (exact match on keyword field)
            if (!empty($filters['category_name'])) {
                $body['query']['bool']['filter'][] = ['term' => ['category_name.keyword' => $filters['category_name']]];
            }

            // Filter by category_slug (exact match)
            if (!empty($filters['category_slug'])) {
                $body['query']['bool']['filter'][] = ['term' => ['category.slug' => $filters['category_slug']]];
            }

            // Filter by slug (exact match)
            if (!empty($filters['slug'])) {
                $body['query']['bool']['filter'][] = ['term' => ['slug' => $filters['slug']]];
            }

            // Filter by ID (exact match)
            if (!empty($filters['id'])) {
                $body['query']['bool']['filter'][] = ['term' => ['id' => $filters['id']]];
            }

            if (isset($filters['is_active'])) {
                $body['query']['bool']['filter'][] = ['term' => ['is_active' => $filters['is_active']]];
            }

            // Price range filter (on variants.config.price - simple query, not nested)
            if (isset($filters['price_min']) || isset($filters['price_max'])) {
                $priceRangeQuery = ['range' => ['variants.config.price' => []]];

                if (isset($filters['price_min'])) {
                    $priceRangeQuery['range']['variants.config.price']['gte'] = $filters['price_min'];
                }
                if (isset($filters['price_max'])) {
                    $priceRangeQuery['range']['variants.config.price']['lte'] = $filters['price_max'];
                }

                $body['query']['bool']['filter'][] = $priceRangeQuery;
            }

            $response = $this->client->search([
                'index' => $this->index,
                'body' => $body
            ]);
            $hits = $response['hits']['hits'] ?? [];
            $total = $response['hits']['total']['value'] ?? 0;

            return [
                'total' => $total,
                'products' => array_map(fn($hit) => $hit['_source'], $hits)
            ];
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Search failed", [
                'query' => $query,
                'error' => $e->getMessage()
            ]);
            return ['total' => 0, 'products' => []];
        }
    }

    /**
     * Search products with text query AND variant config filters
     * Combines text search with nested variant config filtering
     */
    public function searchWithVariantConfig(string $query, array $filters = [], array $configFilters = [], int $size = 10, int $from = 0): array
    {
        try {
            // Build text query part
            $queryPart = empty($query) || $query === '*'
                ? ['match_all' => (object)[]]
                : [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => ['name^3', 'category_name^2', 'brand_name'],
                        'type' => 'best_fields',
                        'operator' => 'or',
                        'minimum_should_match' => '50%'
                    ]
                ];

            $mustQueries = [$queryPart];
            $filterQueries = [];

            // Add product-level filters
            if (!empty($filters['brand_id'])) {
                $filterQueries[] = ['term' => ['brand_id' => $filters['brand_id']]];
            }
            if (!empty($filters['brand_name'])) {
                $filterQueries[] = ['term' => ['brand_name.keyword' => $filters['brand_name']]];
            }
            if (!empty($filters['brand_slug'])) {
                $filterQueries[] = ['term' => ['brand.slug' => $filters['brand_slug']]];
            }
            if (!empty($filters['category_id'])) {
                $filterQueries[] = ['term' => ['category_id' => $filters['category_id']]];
            }
            if (!empty($filters['category_name'])) {
                $filterQueries[] = ['term' => ['category_name.keyword' => $filters['category_name']]];
            }
            if (!empty($filters['category_slug'])) {
                $filterQueries[] = ['term' => ['category.slug' => $filters['category_slug']]];
            }
            if (!empty($filters['slug'])) {
                $filterQueries[] = ['term' => ['slug' => $filters['slug']]];
            }

            // Filter by ID (exact match)
            if (!empty($filters['id'])) {
                $filterQueries[] = ['term' => ['id' => $filters['id']]];
            }

            if (isset($filters['is_active'])) {
                $filterQueries[] = ['term' => ['is_active' => $filters['is_active']]];
            }

            // Price range filter (on variants.config.price - simple query, not nested)
            if (isset($filters['price_min']) || isset($filters['price_max'])) {
                $priceRangeQuery = ['range' => ['variants.config.price' => []]];

                if (isset($filters['price_min'])) {
                    $priceRangeQuery['range']['variants.config.price']['gte'] = $filters['price_min'];
                }
                if (isset($filters['price_max'])) {
                    $priceRangeQuery['range']['variants.config.price']['lte'] = $filters['price_max'];
                }

                $filterQueries[] = $priceRangeQuery;
            }

            // Add config filters (color, size, storage - simple term queries, not nested)
            if (!empty($configFilters)) {
                foreach (['color', 'size', 'storage'] as $field) {
                    if (isset($configFilters[$field])) {
                        $filterQueries[] = ['term' => ["variants.config.{$field}" => $configFilters[$field]]];
                    }
                }
            }
            $body = [
                'query' => [
                    'bool' => [
                        'must' => $mustQueries,
                        'filter' => $filterQueries
                    ]
                ],
                'size' => $size,
                'from' => $from
            ];

            $response = $this->client->search([
                'index' => $this->index,
                'body' => $body
            ]);

            $hits = $response['hits']['hits'] ?? [];
            $total = $response['hits']['total']['value'] ?? 0;

            return [
                'total' => $total,
                'products' => array_map(fn($hit) => $hit['_source'], $hits)
            ];
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Search with variant config failed", [
                'query' => $query,
                'config_filters' => $configFilters,
                'error' => $e->getMessage()
            ]);
            return ['total' => 0, 'products' => []];
        }
    }

    /**
     * Search products by variant config (e.g., color, size)
     */
    public function searchByVariantConfig(array $configFilters, array $filters = [], int $size = 10, int $from = 0): array
    {
        try {
            $nestedQueries = [];

            // Build nested queries for variant config
            foreach ($configFilters as $key => $value) {
                $nestedQueries[] = [
                    'nested' => [
                        'path' => 'variants',
                        'query' => [
                            'nested' => [
                                'path' => 'variants.config',
                                'query' => [
                                    'term' => [
                                        "variants.config.{$key}" => $value
                                    ]
                                ]
                            ]
                        ]
                    ]
                ];
            }

            $body = [
                'query' => [
                    'bool' => [
                        'must' => $nestedQueries,
                        'filter' => []
                    ]
                ],
                'size' => $size,
                'from' => $from
            ];

            // Add regular filters
            if (!empty($filters['brand_id'])) {
                $body['query']['bool']['filter'][] = ['term' => ['brand_id' => $filters['brand_id']]];
            }

            if (!empty($filters['category_id'])) {
                $body['query']['bool']['filter'][] = ['term' => ['category_id' => $filters['category_id']]];
            }

            if (isset($filters['is_active'])) {
                $body['query']['bool']['filter'][] = ['term' => ['is_active' => $filters['is_active']]];
            }

            $response = $this->client->search([
                'index' => $this->index,
                'body' => $body
            ]);

            $hits = $response['hits']['hits'] ?? [];
            $total = $response['hits']['total']['value'] ?? 0;

            return [
                'total' => $total,
                'products' => array_map(fn($hit) => $hit['_source'], $hits)
            ];
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Variant config search failed", [
                'config_filters' => $configFilters,
                'error' => $e->getMessage()
            ]);
            return ['total' => 0, 'products' => []];
        }
    }

    /**
     * Bulk index products
     */
    public function bulkIndex(array $products): bool
    {
        try {
            $params = ['body' => []];

            foreach ($products as $product) {
                $params['body'][] = [
                    'index' => [
                        '_index' => $this->index,
                        '_id' => $product['id']
                    ]
                ];

                // Prepare variants data
                $variants = [];
                if (isset($product['variants']) && is_array($product['variants'])) {
                    foreach ($product['variants'] as $variant) {
                        $config = [];

                        // Parse config JSON if it's a string (handle double encoding)
                        if (isset($variant['config'])) {
                            $configData = $variant['config'];

                            // If it's a string, decode it
                            if (is_string($configData)) {
                                $configData = json_decode($configData, true);
                            }

                            // If it's still a string (double encoded), decode again
                            if (is_string($configData)) {
                                $configData = json_decode($configData, true);
                            }

                            // Handle both array and object formats
                            if (is_array($configData)) {
                                // If it's array of configs, keep them as array
                                if (isset($configData[0]) && is_array($configData[0])) {
                                    // Clean up data types for each config item
                                    $config = array_map(function ($item) {
                                        return [
                                            'color' => $item['color'] ?? '',
                                            'size' => $item['size'] ?? '',
                                            'price' => (float)($item['price'] ?? 0),
                                            'stock' => (int)($item['stock'] ?? 0),
                                            'is_active' => filter_var($item['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN),
                                            'income_number' => (int)($item['income_number'] ?? 0)
                                        ];
                                    }, $configData);
                                } else {
                                    // Single config object
                                    $config = [[
                                        'color' => $configData['color'] ?? '',
                                        'size' => $configData['size'] ?? '',
                                        'price' => (float)($configData['price'] ?? 0),
                                        'stock' => (int)($configData['stock'] ?? 0),
                                        'is_active' => filter_var($configData['is_active'] ?? true, FILTER_VALIDATE_BOOLEAN),
                                        'income_number' => (int)($configData['income_number'] ?? 0)
                                    ]];
                                }
                            }
                        }

                        $variants[] = [
                            'id' => $variant['id'] ?? null,
                            'name' => $variant['name'] ?? '',
                            'price' => (float)($variant['price'] ?? 0),
                            'stock' => (int)($variant['stock'] ?? 0),
                            'is_active' => (bool)($variant['is_active'] ?? true),
                            'config' => $config
                        ];
                    }
                }

                $params['body'][] = [
                    'id' => $product['id'],
                    'name' => $product['name'] ?? $product['product_name'] ?? '',
                    'slug' => $product['slug'] ?? '',
                    'brand_id' => $product['brand_id'] ?? null,
                    'brand_name' => $product['brand']['name'] ?? $product['brand_name'] ?? null,
                    'brand' => isset($product['brand']) ? [
                        'id' => $product['brand']['id'] ?? null,
                        'name' => $product['brand']['name'] ?? null,
                        'slug' => $product['brand']['slug'] ?? null,
                        'logo' => $product['brand']['logo'] ?? null,
                        'is_active' => $product['brand']['is_active'] ?? true,
                    ] : null,
                    'category_id' => $product['category_id'] ?? null,
                    'category_name' => $product['category']['name'] ?? $product['category_name'] ?? null,
                    'category' => isset($product['category']) ? [
                        'id' => $product['category']['id'] ?? null,
                        'name' => $product['category']['name'] ?? null,
                        'slug' => $product['category']['slug'] ?? null,
                        'logo' => $product['category']['logo'] ?? null,
                        'is_active' => $product['category']['is_active'] ?? true,
                    ] : null,
                    'categories' => isset($product['categories']) ? array_map(function ($cat) {
                        return [
                            'id' => $cat['id'] ?? null,
                            'name' => $cat['name'] ?? null,
                            'slug' => $cat['slug'] ?? null,
                            'is_primary' => $cat['pivot']['is_primary'] ?? false,
                            'is_active' => $cat['pivot']['is_active'] ?? true,
                        ];
                    }, $product['categories']) : [],
                    'is_active' => $product['is_active'] ?? true,
                    'created_at' => $product['created_at'] ?? now()->toIso8601String(),
                    'updated_at' => $product['updated_at'] ?? now()->toIso8601String(),
                    'variants' => $variants
                ];
            }

            $response = $this->client->bulk($params);

            if ($response['errors']) {
                Log::channel('elasticsearch')->error("[ES] Bulk index had errors", ['response' => $response]);
                return false;
            }

            Log::channel('elasticsearch')->info("[ES] Bulk indexed products", ['count' => count($products)]);
            return true;
        } catch (\Throwable $e) {
            Log::channel('elasticsearch')->error("[ES] Bulk index failed", ['error' => $e->getMessage()]);
            return false;
        }
    }
}
