<?php

namespace App\Domain\Category\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Domain\Category\Entities\Category;

interface CategoryRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function find(int $id): ?Category;
    public function findBySlug(string $slug): ?Category;
    public function create(array $data): Category;
    public function update(int $id, array $data): Category;
    public function updateBySlug(string $slug, array $data): Category;
    public function delete(int $id): bool;
    public function deleteBySlug(string $slug): bool;
}
