<?php
/**
 * Class ProductVariantAttribute
 *
 * Domain entity representing business object
 * Contains business logic and data validation
 */
namespace App\Domain\ProductVariant\Entities;

use Illuminate\Database\Eloquent\Model;

class ProductVariantAttribute extends Model
{
    protected $table = 'product_variant_attributes';

    protected $fillable = [
        'product_variant_id',
        'attribute',
        'value',
        'is_filterable',
    ];

    public $timestamps = true;

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
