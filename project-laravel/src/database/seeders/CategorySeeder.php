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
        // Seed categories with parent-child structure
        $categoryGroups = [
            [
                'name' => 'Hot Programs',
                'children' => [
                    'Flash Sale',
                    'Online Exclusive Deals',
                    'Stock Clearance – Shock Price',
                    'Hourly Sale',
                    'Subsidy / Cashback Program',
                    'Category Promotions (TV, Fridge, Washing Machine)'
                ]
            ],
            [
                'name' => 'Best Price, Best Seller',
                'children' => [
                    'Best Sellers',
                    'Daily Low Price',
                    'Combo Savings',
                    'DMX Exclusive Products',
                    'Genuine Products – Special Price'
                ]
            ],
            [
                'name' => 'Electronics & Appliances',
                'children' => [
                    'TV', 'Smart TV', 'Android TV', 'Google TV',
                    'Speakers & Audio', 'Bluetooth Speaker', 'Sound System', 'Soundbar',
                    'Air Conditioner', 'Washing Machine', 'Refrigerator', 'Clothes Dryer',
                    'Air Purifier', 'Dehumidifier'
                ]
            ],
            [
                'name' => 'Home Electrical Appliances',
                'children' => [
                    'Rice Cooker', 'Microwave Oven', 'Oven', 'Electric Stove / Induction Cooker',
                    'Blender – Juicer', 'Electric Kettle', 'Air Fryer',
                    'Vacuum Cleaner', 'Electric Fan'
                ]
            ],
            [
                'name' => 'Personal Electronics & Telecom',
                'children' => [
                    'Mobile Phone', 'Tablet', 'Laptop', 'Smart Watch',
                    'Headphone', 'Router – Network Device', 'Storage Device (USB, HDD)'
                ]
            ],
            [
                'name' => 'Beauty & Personal Care',
                'children' => [
                    'Hair Dryer', 'Hair Curler / Straightener', 'Shaver', 'Facial Cleansing Brush',
                    'Electric Toothbrush', 'Massager', 'Weighing Scale'
                ]
            ],
            [
                'name' => 'Household Goods',
                'children' => [
                    'Pot – Pan', 'Knife – Cutting Board', 'Food Container', 'Thermal Bottle',
                    'Kitchen Tools', 'Home Cleaning Tools'
                ]
            ],
            [
                'name' => 'Accessories',
                'children' => [
                    'Charging Cable', 'Charger', 'Power Bank', 'Case – Cover',
                    'Mouse – Keyboard', 'Memory Card', 'Laptop / Phone Accessories'
                ]
            ],
            [
                'name' => 'Used & Display Products',
                'children' => [
                    'Display TV', 'Used Air Conditioner', 'Used Washing Machine', 'Used Refrigerator',
                    'Display Mobile Phone'
                ]
            ],
            [
                'name' => 'Other Products',
                'children' => [
                    'Surveillance Camera', 'Water Heater', 'Water Purifier',
                    'Smart Home Device', 'Office Equipment'
                ]
            ],
            [
                'name' => 'Information & Utility Services',
                'children' => [
                    'Installment', 'Warranty – Repair', 'Installation', 'Old-for-New Exchange',
                    'Invoice – Insurance', 'News – Shopping Advice'
                ]
            ]
        ];

        $order = 1;
        foreach ($categoryGroups as $group) {
            $parent = Category::create([
                'name' => $group['name'],
                'order' => $order++,
                'active' => true,
                'has_promotion' => false,
            ]);
            if (!empty($group['children'])) {
                foreach ($group['children'] as $childName) {
                    Category::create([
                        'name' => $childName,
                        'parent_id' => $parent->id,
                        'order' => $order++,
                        'active' => true,
                        'has_promotion' => false,
                    ]);
                }
            }
        }
    }
}
