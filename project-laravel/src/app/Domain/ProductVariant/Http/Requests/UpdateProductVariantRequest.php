<?php
namespace App\Domain\ProductVariant\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductVariantRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules()
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'logo' => 'nullable|string',
            'order' => 'nullable|integer',
            'has_promotion' => 'boolean',
            'status' => 'in:active,inactive',
            'parent_id' => 'nullable|integer|exists:product_variants,id',
        ];
    }
}
