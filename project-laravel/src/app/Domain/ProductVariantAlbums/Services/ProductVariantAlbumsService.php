<?php
namespace App\Domain\ProductVariantAlbums\Services;
use App\Domain\ProductVariantAlbums\Repositories\ProductVariantAlbumsRepositoryInterface;
use App\Domain\ProductVariantAlbums\Services\UploadService;
use Illuminate\Http\UploadedFile;

class ProductVariantAlbumsService
{
    protected $repo;

    public function __construct(ProductVariantAlbumsRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function list($perPage = 15)
    {
        return $this->repo->paginate($perPage);
    }

 public function create($data)
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


    public function update($id, $data)
    {
        $data['logo'] = $data['logo'] ?? 'images/no-image.png';
        return $this->repo->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repo->delete($id);
    }
}
