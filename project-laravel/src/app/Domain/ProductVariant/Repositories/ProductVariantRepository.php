<?php
namespace App\Domain\ProductVariant\Repositories;
use App\Domain\ProductVariant\Entities\ProductVariant;

class ProductVariantRepository implements ProductVariantRepositoryInterface
{
    public function paginate($perPage = 15) { return ProductVariant::orderBy('id')->paginate($perPage); }
    public function find($id) { return ProductVariant::find($id); }
    public function create($data) {
        if (!empty($data)) {
            $variant = new ProductVariant();
            $variant->product_id = $data['product_id'];
            $variant->name = $data['name'];
            $variant->slug = $data['slug'] ?? null;
            $variant->stock = $data['stock'] ?? 0;
            $variant->avatar_product_variants = $data['avatar_product_variants'] ?? null;
            $variant->description = $data['description'] ?? null;
            $variant->is_active = $data['is_active'] ?? true;
            $variant->save();
            $variantDataAlbum['product_variant_id'] = $variant->id;
            return $variantDataAlbum;
          }
        }
    public function update($id, $data) { $item = ProductVariant::findOrFail($id); $item->update($data); return $item; }
    public function delete($id) { return (bool) ProductVariant::findOrFail($id)->delete(); }
}
