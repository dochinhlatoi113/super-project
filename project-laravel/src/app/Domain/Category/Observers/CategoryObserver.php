<?php

namespace App\Domain\Category\Observers;

use App\Domain\Category\Entities\Category;
use Illuminate\Support\Str;

class CategoryObserver
{
    public function creating(Category $model)
    {
        if (empty($model->slug)) {
            $model->slug = Str::slug($model->name);
        }
    }

    public function updating(Category $model)
    {
        if (empty($model->slug)) {
            $model->slug = Str::slug($model->name);
        }
    }
}
