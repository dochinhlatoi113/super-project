<?php
namespace App\Domain\ProductVariant\Services;
use App\Domain\ProductVariant\Repositories\ProductVariantRepositoryInterface;

class ProductVariantService
{
    protected $repo;

    public function __construct(ProductVariantRepositoryInterface $repo)
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
        return $this->repo->create($data);
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
