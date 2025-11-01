<?php

namespace App\Domain\Product\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use SoftDeletes;

    protected $table = 'products';

    protected $fillable = [
        'name',
        'brand_id',
        'slug',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Boot method - auto generate slug from name if empty
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug) && !empty($product->name)) {
                $product->slug = static::generateUniqueSlug($product->name);
            }
        });

        static::updating(function ($product) {
            if (empty($product->slug) && !empty($product->name)) {
                $product->slug = static::generateUniqueSlug($product->name, $product->id);
            }
        });
    }

    /**
     * Generate unique slug
     */
    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::slugExists($slug, $ignoreId)) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    /**
     * Check if slug exists
     */
    protected static function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        $query = static::where('slug', $slug);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    public function brand()
    {
        return $this->belongsTo(\App\Domain\Brand\Entities\Brand::class);
    }

    public function categories()
    {
        return $this->belongsToMany(\App\Domain\Category\Entities\Category::class, 'product_category')
            ->withPivot(['is_primary', 'is_active'])
            ->withTimestamps();
    }

    public function variant()
    {
        return $this->hasOne(\App\Domain\ProductVariant\Entities\ProductVariant::class);
    }

    public function variants()
    {
        return $this->hasMany(\App\Domain\ProductVariant\Entities\ProductVariant::class);
    }
}
