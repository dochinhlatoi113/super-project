<?php

namespace App\Domain\ProductVariant\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use SoftDeletes;

    protected $table = 'product_variants';

    protected $fillable = [
        'product_id',
        'name',
        'price',
        'slug',
        'stock',
        'avatar_product_variants',
        'description',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $visible = ['id', 'name', 'primarySku'];

    public function product()
    {
        return $this->belongsTo(\App\Domain\Product\Entities\Product::class);
    }

    public function albums()
    {
        return $this->hasMany(\App\Domain\ProductVariantAlbums\Entities\ProductVariantAlbums::class, 'product_variant_id')
            ->where('is_active', 1);
    }

    public function skus()
    {
        return $this->hasMany(\App\Domain\ProductSku\Entities\ProductSku::class, 'product_variant_id')
            ->where('is_active', true);
    }

    public function primarySku()
    {
        return $this->hasOne(\App\Domain\ProductSku\Entities\ProductSku::class, 'product_variant_id')
            ->where('is_primary', true)
            ->where('is_active', true);
    }
}
