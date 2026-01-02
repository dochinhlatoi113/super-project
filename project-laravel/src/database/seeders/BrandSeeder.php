<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Brand\Entities\Brand;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $brands = [
            'Apple', 'Samsung', 'Sony', 'LG', 'Panasonic', 
            'Microsoft', 'Intel', 'Dell', 'HP', 'Asus'
        ];

        foreach ($brands as $base) {
            Brand::firstOrCreate(
                ['slug' => Str::slug($base)],
                [
                    'name' => $base,
                    'logo' => 'images/no-image.png',
                    'has_promotion' => $faker->boolean,
                    'order' => $faker->numberBetween(1, 100),
                    'status' => 'active',
                ]
            );
        }
    }
}

