<?php

namespace App\Domain\Category\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
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
            'parent_id' => 'nullable|integer|exists:categories,id',
        ];
    }
}
