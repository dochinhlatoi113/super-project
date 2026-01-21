<?php
/**
 * Class StoreAlbumsProductVariantAlbumsRequest
 *
 * Request validation class
 * Handles input validation and authorization
 */
namespace App\Domain\ProductVariantAlbums\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAlbumsProductVariantAlbumsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'images' => 'required|min:1',
            'images.*' => 'required|image|max:2048',
        ];
    }
}
