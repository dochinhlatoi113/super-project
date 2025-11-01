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
        'config',
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
        'config' => 'array',
    ];

    protected $visible = ['id', 'name', 'append_config_variants', 'primarySku'];


    protected $appends = ['append_config_variants'];

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

    public function getAppendConfigVariantsAttribute()
    {
        $config = is_string($this->config) ? json_decode($this->config, true) : $this->config;
        if (!is_array($config)) {
            return [];
        }

        $allAlbums = $this->albums;

        return collect($config)->map(function ($item) use ($allAlbums) {
            if (!isset($item['income_number'])) {
                return $item;
            }

            $albumsForConfig = $allAlbums->filter(function ($album) use ($item) {
                return $album->income_number == $item['income_number'];
            })->values();

            $item['avatar'] = $item->avatar_product_variants ?? null;
            $item['append_albums'] = $albumsForConfig;

            return $item;
        })->values()->toArray();
    }
}
