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
        // Seed categories 
        $categories = [
            'TVs, Speakers, Karaoke Systems, Cameras',
            'Refrigerators, Freezers, Dishwashers',
            'Washing Machines, Dryers, Water Heaters',
            'Air Conditioners, Fans, Air Purifiers',
            'Home Appliances, Vacuum Cleaners, Air Fryers',
            'Kitchenware, Electric Stoves, Rice Cookers',
            'Water Filters, Blenders, Juicers',
            'Health, Beauty, Baby Products',
            'Phones, Tablets, Accessories',
            'Laptops, PCs, Office Equipment',
            'Services & Support',
            'Useful Information',
            'Business Sales',
        ];

        foreach ($categories as $i => $name) {
            Category::create([
                'name' => $name,
                'order' => $i + 1,
                'active' => true,
                'has_promotion' => false,
            ]);
        }
    }
}
