<?php
/**
 * Class UpdateProductRequest
 *
 * Request validation class
 * Handles input validation and authorization
 */
namespace App\Domain\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            // Product (partial updates allowed)
            'product.name' => ['sometimes', 'string', 'max:255'],
            'product.slug' => ['sometimes', 'string', 'max:255', 'nullable'],
            'product.brand_id' => ['sometimes', 'integer', 'exists:brands,id'],
            'categories' => ['sometimes', 'array', 'nullable'],
            'categories.*.id' => ['sometimes', 'integer', 'exists:categories,id'],
            'categories.*.is_primary' => ['sometimes', 'boolean'],
            'categories.*.is_active' => ['sometimes', 'boolean'],
            'product.is_active' => ['sometimes', 'boolean'],

            // Product variant
            'product_variant.name' => ['sometimes', 'string', 'max:255'],
            'product_variant.slug' => ['sometimes', 'string', 'max:255', 'nullable'],
            'product_variant.stock' => ['sometimes', 'integer', 'min:0', 'nullable'],
            'product_variant.description' => ['sometimes', 'string', 'nullable'],
            'product_variant.sku' => ['sometimes', 'string', 'max:255', 'nullable'],
            'product_variant.barcode' => ['sometimes', 'string', 'max:255', 'nullable'],

            // Note: SKU and barcode uniqueness validation is handled in ProductSkuService

            // Config entries (partial)
            'product_variant.config.*.color' => ['sometimes', 'string'],
            'product_variant.config.*.size' => ['sometimes', 'string'],
            'product_variant.config.*.price' => ['sometimes', 'integer'],
            'product_variant.config.*.stock' => ['sometimes', 'integer', 'min:0'],
            'product_variant.config.*.is_active' => ['sometimes', 'boolean'],

            // Albums
            'product_variant.config.*.product_variant_albums' => ['sometimes', 'array'],
            'product_variant.config.*.product_variant_albums.*.file' => ['sometimes', 'file'],
            'product_variant.config.*.product_variant_albums.*.alt' => ['sometimes', 'string', 'nullable'],
        ];
    }
}
