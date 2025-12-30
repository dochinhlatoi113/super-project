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

        for ($i = 0; $i < 20; $i++) {
            $brands = [
                'Apple', 'Samsung', 'Sony', 'LG', 'Panasonic', 
                'Microsoft', 'Intel', 'Dell', 'HP', 'Asus'
            ];

            for ($i = 0; $i < 20; $i++) {
                $base = $faker->randomElement($brands);
                Brand::create([
                    'name' => $base,
                    'slug' => Str::slug($base),
                    'logo' => 'images/no-image.png',
                    'has_promotion' => $faker->boolean,
                    'order' => $faker->numberBetween(1, 100),
                    'status' => 'active',
                ]);
            }

        }
    }
}

