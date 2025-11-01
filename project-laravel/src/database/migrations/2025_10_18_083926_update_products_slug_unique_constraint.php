<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop old constraint if exists
        $indexes = DB::select("SHOW INDEX FROM products WHERE Key_name = 'products_slug_unique'");
        if (count($indexes) > 0) {
            DB::statement('ALTER TABLE products DROP INDEX products_slug_unique');
        }

        // Add virtual column: slug_active = slug when deleted_at IS NULL, else NULL
        DB::statement('ALTER TABLE products ADD COLUMN slug_active VARCHAR(255) AS (IF(deleted_at IS NULL, slug, NULL)) STORED');

        // Add unique constraint on slug_active (only enforces uniqueness for active products)
        DB::statement('ALTER TABLE products ADD UNIQUE INDEX products_slug_active_unique (slug_active)');
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop new constraint and column
        DB::statement('ALTER TABLE products DROP INDEX products_slug_active_unique');
        DB::statement('ALTER TABLE products DROP COLUMN slug_active');

        // Restore old constraint
        DB::statement('ALTER TABLE products ADD UNIQUE INDEX products_slug_unique (slug)');
    }
};
