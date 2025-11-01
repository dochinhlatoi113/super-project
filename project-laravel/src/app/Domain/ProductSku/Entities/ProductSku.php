<?php

namespace App\Domain\ProductSku\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductSku extends Model
{
    use SoftDeletes;

    protected $table = 'product_skus';

    protected $fillable = [
        'product_variant_id',
        'config_index',
        'sku',
        'barcode',
        'type',
        'is_primary',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Relationship with ProductVariant
     */
    public function variant()
    {
        return $this->belongsTo(\App\Domain\ProductVariant\Entities\ProductVariant::class, 'product_variant_id');
    }

    /**
     * Get the product through variant
     */
    public function product()
    {
        return $this->hasOneThrough(
            \App\Domain\Product\Entities\Product::class,
            \App\Domain\ProductVariant\Entities\ProductVariant::class,
            'id', // Foreign key on product_variants table
            'id', // Foreign key on products table
            'product_variant_id', // Local key on product_skus table
            'product_id' // Local key on product_variants table
        );
    }

    /**
     * Scope for active SKUs
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for primary SKUs
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope for specific type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Generate unique SKU if not provided
     */
    public static function generateUniqueSku($prefix = 'SKU', $length = 8)
    {
        do {
            $sku = $prefix . '-' . strtoupper(substr(md5(uniqid()), 0, $length));
        } while (self::where('sku', $sku)->exists());

        return $sku;
    }

    /**
     * Generate unique barcode if not provided
     */
    public static function generateUniqueBarcode($length = 12)
    {
        do {
            $barcode = '';
            for ($i = 0; $i < $length; $i++) {
                $barcode .= rand(0, 9);
            }
        } while (self::where('barcode', $barcode)->exists());

        return $barcode;
    }
}
