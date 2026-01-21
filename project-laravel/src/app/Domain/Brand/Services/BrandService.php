<?php

namespace App\Domain\Brand\Services;

use App\Domain\Brand\Repositories\BrandRepositoryInterface;

/**
 * Class BrandService
 *
 * Service layer for handling business logic related to Brand
 * Provides CRUD methods and business operations for Brand
 */
class BrandService
{
    protected BrandRepositoryInterface $repo;

    /**
     * BrandService constructor.
     *
     * @param BrandRepositoryInterface $repo Repository instance for database operations
     */
    public function __construct(BrandRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get paginated list of brands
     *
     * @param int $perPage Number of items per page (default: 15)
     * @return mixed Paginated list of brands
     */
    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    /**
     * Find brand by slug
     *
     * @param string $slug Slug of the brand to find
     * @return mixed|null Brand object if found, null if not found
     */
    public function findBySlug(string $slug)
    {
        return $this->repo->findBySlug($slug);
    }

    /**
     * Create a new brand
     *
     * @param array $data Brand data to create (name, slug, description, logo)
     * @return mixed Created brand object
     */
    public function create(array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->create($data);
    }

    /**
     * Update brand by slug
     *
     * @param string $slug Slug of the brand to update
     * @param array $data Data to update (name, slug, description, logo)
     * @return mixed Updated brand object
     */
    public function update(string $slug, array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->updateBySlug($slug, $data);
    }

    /**
     * Delete brand by slug
     *
     * @param string $slug Slug of the brand to delete
     * @return bool True if deletion successful, false if failed
     */
    public function delete(string $slug): bool
    {
        return $this->repo->deleteBySlug($slug);
    }
}
