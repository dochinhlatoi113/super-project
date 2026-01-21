<?php
/**
 * Interface ProductVariantAttributeRepository
 *
 * Repository interface for data access operations
 * Defines contract for data layer implementations
 */
namespace App\Domain\ProductVariant\Repositories;

use App\Domain\ProductVariant\Entities\ProductVariantAttribute;

class ProductVariantAttributeRepository
{
    public function createMany($productVariantId, $attributes)
    {
        $data = [];
        foreach ($attributes as $attr) {
            $data[] = [
                'product_variant_id' => $productVariantId,
                'attribute' => $attr['attribute'],
                'value' => $attr['value'],
                'is_filterable' => $attr['is_filterable'] ?? false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        ProductVariantAttribute::insert($data);
    }

    public function updateOrCreateMany($productVariantId, $attributes)
    {
        foreach ($attributes as $attr) {
            ProductVariantAttribute::updateOrCreate(
                [
                    'product_variant_id' => $productVariantId,
                    'attribute' => $attr['attribute'],
                ],
                [
                    'value' => $attr['value'],
                    'is_filterable' => $attr['is_filterable'] ?? false,
                ]
            );
        }
    }

    public function getByVariant($productVariantId)
    {
        return ProductVariantAttribute::where('product_variant_id', $productVariantId)->get();
    }
}
