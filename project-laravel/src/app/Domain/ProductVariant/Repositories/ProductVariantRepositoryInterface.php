<?php
namespace App\Domain\ProductVariant\Repositories;
use App\Domain\ProductVariant\Entities\ProductVariant;

interface ProductVariantRepositoryInterface
{
    public function paginate($perPage = 15);
    public function find($id);
    public function create($data);
    public function update($id, $data);
    public function delete($id);
}
