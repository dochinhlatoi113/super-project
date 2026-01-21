<?php
/**
 * Class ProductVariantAlbums
 *
 * Domain entity representing business object
 * Contains business logic and data validation
 */
namespace App\Domain\ProductVariantAlbums\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariantAlbums extends Model
{
    use SoftDeletes;

    protected $table = 'product_variant_album';

    protected $fillable = [
        'product_variant_id',
        'url',
        'is_active',
        'income_number',
        'log',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'income_number' => 'integer',
    ];

    public function variant()
    {
        return $this->belongsTo(\App\Domain\ProductVariant\Entities\ProductVariant::class, 'product_variant_id');
    }
}
