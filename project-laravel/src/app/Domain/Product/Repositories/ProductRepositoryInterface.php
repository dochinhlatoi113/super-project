<?php

namespace App\Domain\Product\Repositories;

use App\Domain\Product\Entities\Product;

interface ProductRepositoryInterface
{
    public function paginate($perPage = 15);
    public function find($id);
    public function findBySlug(string $slug);
    public function create($data);
    public function update($id, $data);
    public function updateBySlug(string $slug, array $data);
    public function delete($id);
    public function deleteBySlug(string $slug);
}
