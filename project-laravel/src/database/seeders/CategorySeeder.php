<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Domain\Category\Entities\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
           $electronics = Category::create([
            'name' => 'Electronics',
            'order' => 1,
            'active' => true,
            'has_promotion' => true,
        ]);

        $phones = Category::create([
            'name' => 'Smart Phones',
            'parent_id' => $electronics->id,
            'order' => 1,
            'active' => true,
            'has_promotion' => false,
        ]);

        $laptops = Category::create([
            'name' => 'Laptops',
            'parent_id' => $electronics->id,
            'order' => 2,
            'active' => true,
            'has_promotion' => true,
        ]);

        $fashion = Category::create([
            'name' => 'Fashion',
            'order' => 2,
            'active' => true,
            'has_promotion' => false,
        ]);
    }
}
