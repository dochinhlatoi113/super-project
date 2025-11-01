<?php
namespace App\Domain\ProductVariantAlbums\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductVariantAlbumsRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'logo' => 'nullable|string',
            'order' => 'nullable|integer',
            'has_promotion' => 'boolean',
            'status' => 'in:active,inactive',
            'parent_id' => 'nullable|integer|exists:product_variant_albums,id',
        ];
    }
}
