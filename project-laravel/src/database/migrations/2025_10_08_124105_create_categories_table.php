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
       if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade'); 
                $table->integer('order')->default(0); 
                $table->string('slug')->nullable()->unique();
                $table->boolean('active')->default(true); 
                $table->boolean('has_promotion')->default(false); 
                $table->timestamps();
                $table->softDeletes(); 
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         if (Schema::hasTable('categories')) {
            Schema::dropIfExists('categories');
        }
    }
};
