<?php
/**
 * Interface CategoryRepository
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */
namespace App\Domain\Category\Repositories;

use App\Domain\Category\Entities\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CategoryRepository implements CategoryRepositoryInterface
{
    /**
     * Paginate categories with parent and sub-categories relationship.
     * If $parentId is null, return top-level categories with their children.
     * If $parentId is provided, return all categories with that parent_id (siblings).
     */
    public function paginate(int $perPage = 15, $parentId = null): LengthAwarePaginator
    {
        $query = Category::with(['subCategories'])->orderBy('order');
        
        if (is_null($parentId)) {
            $query->whereNull('parent_id');
        } else {
            $query->where('parent_id', $parentId);
        }
        
        return $query->paginate($perPage);
    }

    public function find(int $id): ?Category
    {
        return Category::find($id);
    }

    public function findBySlug(string $slug): ?Category
    {
        return Category::with(['products'])->where('slug', $slug)->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(int $id, array $data): Category
    {
        $item = Category::findOrFail($id);
        $item->update($data);
        return $item;
    }

    public function updateBySlug(string $slug, array $data): Category
    {
        $item = Category::where('slug', $slug)->firstOrFail();
        $item->update($data);
        return $item;
    }

    public function delete(int $id): bool
    {
        return (bool) Category::findOrFail($id)->delete();
    }

    public function deleteBySlug(string $slug): bool
    {
        $item = Category::where('slug', $slug)->firstOrFail();
        return (bool) $item->delete();
    }
}
