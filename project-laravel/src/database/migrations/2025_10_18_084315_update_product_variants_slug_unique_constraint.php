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
        $indexes = DB::select("SHOW INDEX FROM product_variants WHERE Key_name = 'product_variants_slug_unique'");
        if (count($indexes) > 0) {
            DB::statement('ALTER TABLE product_variants DROP INDEX product_variants_slug_unique');
        }

        // Add virtual column: slug_active = slug when deleted_at IS NULL, else NULL
        DB::statement('ALTER TABLE product_variants ADD COLUMN slug_active VARCHAR(255) AS (IF(deleted_at IS NULL, slug, NULL)) STORED');

        // Add unique constraint on slug_active (only enforces uniqueness for active variants)
        DB::statement('ALTER TABLE product_variants ADD UNIQUE INDEX product_variants_slug_active_unique (slug_active)');
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop new constraint and column
        DB::statement('ALTER TABLE product_variants DROP INDEX product_variants_slug_active_unique');
        DB::statement('ALTER TABLE product_variants DROP COLUMN slug_active');

        // Restore old constraint
        DB::statement('ALTER TABLE product_variants ADD UNIQUE INDEX product_variants_slug_unique (slug)');
    }
};
