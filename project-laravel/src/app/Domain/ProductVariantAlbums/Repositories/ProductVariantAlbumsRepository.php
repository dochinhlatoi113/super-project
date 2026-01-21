<?php
/**
 * Interface ProductVariantAlbumsRepository
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */namespace App\Domain\ProductVariantAlbums\Repositories;
use App\Domain\ProductVariantAlbums\Entities\ProductVariantAlbums;

class ProductVariantAlbumsRepository implements ProductVariantAlbumsRepositoryInterface
{
    public function paginate($perPage = 15) { return ProductVariantAlbums::orderBy('id')->paginate($perPage); }
    public function find($id) { return ProductVariantAlbums::find($id); }
    public function create($data) 
    { 
        foreach ($data as $key => $value) {
            $data = new ProductVariantAlbums;
            $data->url = $value['url'];
            $data->income_number = $value['income_number'];
            $data->is_active = $value['is_active'];
            $data->product_variant_id = $value['product_variant_id'];
            $data->save();
        }
        return $data; 
    }
    public function update($id, $data) { $item = ProductVariantAlbums::findOrFail($id); $item->update($data); return $item; }
    public function delete($id) { return (bool) ProductVariantAlbums::findOrFail($id)->delete(); }
}
