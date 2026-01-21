<?php
/**
 * Interface BrandRepository
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */
namespace App\Domain\Brand\Repositories;

use App\Domain\Brand\Entities\Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BrandRepository implements BrandRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Brand::orderBy('order')->paginate($perPage);
    }

    public function find(int $id): ?Brand
    {
        return Brand::find($id);
    }

    public function findBySlug(string $slug): ?Brand
    {
        return Brand::where('slug', $slug)->first();
    }

    public function create(array $data): Brand
    {
        return Brand::create($data);
    }

    public function update(int $id, array $data): Brand
    {
        $item = Brand::findOrFail($id);
        $item->update($data);
        return $item;
    }

    public function updateBySlug(string $slug, array $data): Brand
    {
        $item = Brand::where('slug', $slug)->firstOrFail();
        $item->update($data);
        return $item;
    }

    public function delete(int $id): bool
    {
        return (bool) Brand::findOrFail($id)->delete();
    }

    public function deleteBySlug(string $slug): bool
    {
        $item = Brand::where('slug', $slug)->firstOrFail();
        return (bool) $item->delete();
    }
}
