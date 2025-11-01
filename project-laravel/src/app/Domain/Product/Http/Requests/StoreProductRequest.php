<?php

namespace App\Domain\Product\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {

        return [
            // ---- PRODUCT ----
            //'product' => ['required', 'array'],
            'product.name' => ['required', 'string', 'max:255'],
            'product.slug' => ['nullable', 'string', 'max:255'],
            'product.brand_id' => ['required', 'integer', 'exists:brands,id'],
            'categories' => ['nullable', 'array', 'min:1'],
            'categories.*.id' => ['required', 'integer', 'exists:categories,id'],
            'categories.*.is_primary' => ['boolean'],
            'categories.*.is_active' => ['boolean'],
            'product.is_active' => ['boolean'],

            // // ---- PRODUCT VARIANT ----
            //'product_variant' => ['required', 'array'],
            'product_variant.name' => ['required', 'string', 'max:255'],
            'product_variant.slug' => ['nullable', 'string', 'max:255'],
            'product_variant.stock' => ['nullable', 'integer', 'min:0'],
            // 'product_variant.price' => ['required', 'numeric', 'min:0'],
            'product_variant.description' => ['nullable', 'string'],
            // // ---- SKU ----
            'product_variant.sku' => ['nullable', 'array'],
            'product_variant.sku.*.sku' => ['required', 'string', 'max:255', 'unique:product_skus,sku'],
            'product_variant.sku.*.type' => ['required', 'string', 'in:sku,upc,ean,isbn,qr_code'],
            'product_variant.sku.*.is_primary' => ['boolean'],
            'product_variant.sku.*.product_variant_config_index' => ['required', 'integer', 'min:0'],

            // // ---- BARCODE ----
            'product_variant.barcode' => ['nullable', 'array'],
            'product_variant.barcode.*.barcode' => ['required', 'string', 'max:255', 'unique:product_skus,barcode'],
            'product_variant.barcode.*.type' => ['required', 'string', 'in:sku,upc,ean,isbn,qr_code'],
            'product_variant.barcode.*.is_primary' => ['boolean'],
            'product_variant.barcode.*.product_variant_config_index' => ['required', 'integer', 'min:0'],

            // // // ---- CONFIG ----
            // // 'product_variant.config' => ['required', 'array', 'min:1'],
            'product_variant.config.*.color' => ['required', 'string'],
            'product_variant.config.*.size' => ['required', 'string'],
            'product_variant.config.*.price' => ['required', 'integer'],
            'product_variant.config.*.stock' => ['required', 'integer', 'min:0'],
            'product_variant.config.*.is_active' => ['boolean'],


            // // // ---- ALBUMS  ----
            'product_variant.config.*.product_variant_albums' => ['nullable', 'array'],
            'product_variant.config.*.product_variant_albums.*.file' => ['required_with:product_variant.config.*.product_variant_albums', 'file'],
            // 'product_variant.config.*.product_variant_albums.*.alt' => ['nullable', 'string'],
        ];
    }
}
