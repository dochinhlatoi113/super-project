<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateProductCategories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-product-categories';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing product category_id to product_category pivot table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of product categories...');

        // Get all products with category_id
        $products = \App\Domain\Product\Entities\Product::whereNotNull('category_id')->get();

        $this->info("Found {$products->count()} products with category_id");

        foreach ($products as $product) {
            // Check if relation already exists
            $exists = DB::table('product_category')
                ->where('product_id', $product->id)
                ->where('category_id', $product->category_id)
                ->exists();

            if (!$exists) {
                DB::table('product_category')->insert([
                    'product_id' => $product->id,
                    'category_id' => $product->category_id,
                    'is_primary' => true, // Assume old category is primary
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->line("Migrated product {$product->id} to category {$product->category_id}");
            } else {
                $this->line("Relation already exists for product {$product->id}");
            }
        }

        $this->info('Migration completed successfully!');
    }
}
