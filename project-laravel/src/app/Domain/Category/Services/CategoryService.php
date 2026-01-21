<?php

namespace App\Domain\Category\Services;

use App\Domain\Category\Repositories\CategoryRepositoryInterface;

/**
 * Class CategoryService
 *
 * Service layer for handling business logic related to Category
 * Provides CRUD methods and business operations for Category
 */
class CategoryService
{
    protected CategoryRepositoryInterface $repo;

    /**
     * CategoryService constructor.
     *
     * @param CategoryRepositoryInterface $repo Repository instance for database operations
     */
    public function __construct(CategoryRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get paginated list of categories
     *
     * @param int $perPage Number of items per page (default: 15)
     * @return mixed Paginated list of categories
     */
    public function list(int $perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    /**
     * Find category by slug
     *
     * @param string $slug Slug of the category to find
     * @return mixed|null Category object if found, null if not found
     */
    public function findBySlug(string $slug)
    {
        return $this->repo->findBySlug($slug);
    }

    /**
     * Create a new category
     *
     * @param array $data Category data to create (name, slug, description, logo)
     * @return mixed Created category object
     */
    public function create(array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->create($data);
    }

    /**
     * Update category by slug
     *
     * @param string $slug Slug of the category to update
     * @param array $data Data to update (name, slug, description, logo)
     * @return mixed Updated category object
     */
    public function update(string $slug, array $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->updateBySlug($slug, $data);
    }

    /**
     * Delete category by slug
     *
     * @param string $slug Slug of the category to delete
     * @return bool True if deletion successful, false if failed
     */
    public function delete(string $slug): bool
    {
        return $this->repo->deleteBySlug($slug);
    }
}
