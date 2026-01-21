<?php
/**
 * Class ProductVariantService
 *
 * Service layer for handling business logic
 * Provides CRUD operations and business rules
 */namespace App\Domain\ProductVariant\Services;
use App\Domain\ProductVariant\Repositories\ProductVariantRepositoryInterface;

class ProductVariantService
{
    protected $repo;

    /**
     * ProductVariantService constructor.
     *
     * @param mixed $repo Repository instance for data operations
     */    public function __construct(ProductVariantRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Get paginated list of items
     *
     * @param int $perPage Number of items per page
     * @return mixed Paginated list of items
     */    public function list($perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

    /**
     * Create a new item
     *
     * @param array $data Item data to create
     * @return mixed Created item object
     */    public function create($data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->create($data);
    }

    /**
     * Update an existing item
     *
     * @param string $slug Item slug
     * @param array $data Data to update
     * @return mixed Updated item object
     */    public function update($id, $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->update($id, $data);
    }

    /**
     * Delete an item by slug
     *
     * @param string $slug Item slug
     * @return bool True if successful, false otherwise
     */    public function delete($id)
    {
        return $this->repo->delete($id);
    }
}
