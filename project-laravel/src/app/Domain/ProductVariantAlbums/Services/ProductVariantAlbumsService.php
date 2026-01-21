<?php
/**
 * Class ProductVariantAlbumsService
 *
 * Service layer for handling business logic
 * Provides CRUD operations and business rules
 */namespace App\Domain\ProductVariantAlbums\Services;
use App\Domain\ProductVariantAlbums\Repositories\ProductVariantAlbumsRepositoryInterface;
use App\Domain\ProductVariantAlbums\Services\UploadService;
use Illuminate\Http\UploadedFile;

class ProductVariantAlbumsService
{
    protected $repo;

    /**
     * ProductVariantAlbumsService constructor.
     *
     * @param mixed $repo Repository instance for data operations
     */    public function __construct(ProductVariantAlbumsRepositoryInterface $repo)
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
     */ public function create($data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';

        $uploadService = new UploadService();
        $dataUploadImgCloud = [];
        $hasUploaded = false;

        foreach ($data as $item) {
            if (!empty($item['product_variant_albums'])) {
                foreach ($item['product_variant_albums'] as $album) {
                    $file = $album['file'] ?? null;

                    if ($file instanceof UploadedFile) {
                        $hasUploaded = true;

                        $url = $uploadService->upload($file);

                        $dataUploadImgCloud[] = [
                            'url' => $url,
                            'alt' => $album['alt'] ?? null,
                            'income_number' => $item['income_number'] ?? null,
                            'is_active' => true,
                            'product_variant_id' => $data['product_variant_id']
                        ];
                    }
                }
            }
        }

        if ($hasUploaded) {
            return $this->repo->create($dataUploadImgCloud);
        }

        return null;
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
