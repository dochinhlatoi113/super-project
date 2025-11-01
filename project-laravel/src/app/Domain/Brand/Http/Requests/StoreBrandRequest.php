<?php

namespace App\Domain\Brand\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'logo' => 'nullable|string',
            'order' => 'nullable|integer',
            'has_promotion' => 'boolean',
            'status' => 'in:active,inactive',
            'parent_id' => 'nullable|integer|exists:brands,id',
        ];
    }
}
