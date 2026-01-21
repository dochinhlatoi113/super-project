<?php
/**
 * Class UpdateBrandRequest
 *
 * Request validation class
 * Handles input validation and authorization
 */
namespace App\Domain\Brand\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|nullable|string|max:255',
            'logo' => 'nullable|string',
            'order' => 'nullable|integer',
            'has_promotion' => 'boolean',
            'status' => 'in:active,inactive',
            'parent_id' => 'nullable|integer|exists:brands,id',
        ];
    }
}
