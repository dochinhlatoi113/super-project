<?php

namespace App\Domain\Category\Repositories;

use App\Domain\Category\Entities\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
         return Category::orderBy('order')->paginate($perPage);
    }

    public function find(int $id): ?Category
    {
        return Category::find($id);
    }

    public function findBySlug(string $slug): ?Category
    {
        return Category::where('slug', $slug)->first();
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
