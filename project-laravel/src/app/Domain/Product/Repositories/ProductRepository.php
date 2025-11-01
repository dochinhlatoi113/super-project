<?php

namespace App\Domain\Product\Repositories;

use App\Domain\Product\Entities\Product;

class ProductRepository implements ProductRepositoryInterface
{
    public function paginate($perPage = 15)
    {

        return Product::with(['variants.primarySku', 'brand', 'categories'])->orderBy('id', 'desc')->paginate($perPage);
    }

    public function find($id)
    {
        return Product::find($id);
    }

    public function findBySlug(string $slug)
    {
        return Product::where('slug', $slug)->first();
    }

    public function create($data)
    {
        return Product::create($data);
    }

    public function update($id, $data)
    {
        $item = Product::findOrFail($id);
        $item->update($data);
        return $item;
    }

    public function updateBySlug(string $slug, array $data)
    {
        $item = Product::where('slug', $slug)->firstOrFail();
        $item->update($data);
        return $item;
    }

    public function delete($id)
    {
        return (bool) Product::findOrFail($id)->delete();
    }

    public function deleteBySlug(string $slug)
    {
        $item = Product::where('slug', $slug)->firstOrFail();
        return (bool) $item->delete();
    }
}
