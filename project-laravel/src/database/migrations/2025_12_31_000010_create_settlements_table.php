<?php
// database/migrations/2025_12_31_000010_create_settlements_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('settlements')) {
            Schema::create('settlements', function (Blueprint $table) {
                $table->id();
                $table->string('gateway');
                $table->date('settlement_date');
                $table->decimal('total_amount', 15, 2);
                $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
                $table->timestamps();
            });
        }
    }
    public function down() {
        Schema::dropIfExists('settlements');
    }
};
