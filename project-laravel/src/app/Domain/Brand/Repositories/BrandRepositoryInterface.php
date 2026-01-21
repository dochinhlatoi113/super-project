<?php
/**
 * Interface BrandRepositoryInterface
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */
namespace App\Domain\Brand\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Domain\Brand\Entities\Brand;

interface BrandRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function find(int $id): ?Brand;
    public function findBySlug(string $slug): ?Brand;
    public function create(array $data): Brand;
    public function update(int $id, array $data): Brand;
    public function updateBySlug(string $slug, array $data): Brand;
    public function delete(int $id): bool;
    public function deleteBySlug(string $slug): bool;
}
