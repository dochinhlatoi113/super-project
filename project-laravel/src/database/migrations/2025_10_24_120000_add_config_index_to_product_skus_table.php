<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('product_skus', function (Blueprint $table) {
            $table->unsignedInteger('config_index')->nullable()->after('product_variant_id')
                ->comment('Index of the config in product_variant.config array that this SKU belongs to');
            $table->index(['product_variant_id', 'config_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_skus', function (Blueprint $table) {
            $table->dropIndex(['product_variant_id', 'config_index']);
            $table->dropColumn('config_index');
        });
    }
};
