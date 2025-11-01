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
                $suffix = $faker->unique()->numberBetween(1, 100); 
                $name = $base . " {$suffix}";

                Brand::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'logo' => 'images/no-image.png',
                    'has_promotion' => $faker->boolean,
                    'order' => $faker->numberBetween(1, 100),
                    'status' => 'active',
                ]);
            }

        }
    }
}

