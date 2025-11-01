<?php
namespace App\Domain\ProductVariantAlbums\Repositories;
use App\Domain\ProductVariantAlbums\Entities\ProductVariantAlbums;

interface ProductVariantAlbumsRepositoryInterface
{
    public function paginate($perPage = 15);
    public function find($id);
    public function create($data);
    public function update($id, $data);
    public function delete($id);
}
