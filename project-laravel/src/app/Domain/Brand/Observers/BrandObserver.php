<?php
/**
 * Class BrandObserver
 *
 * Model observer for handling model events
 * Automatically triggers actions on model lifecycle events
 */
namespace App\Domain\Brand\Observers;

use App\Domain\Brand\Entities\Brand;
use Illuminate\Support\Str;

class BrandObserver
{
    public function creating(Brand $model)
    {
        if (empty($model->slug)) {
            $model->slug = Str::slug($model->name);
        }
    }

    public function updating(Brand $model)
    {
        if (empty($model->slug)) {
            $model->slug = Str::slug($model->name);
        }
    }
}
