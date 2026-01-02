<?php
// database/migrations/2025_12_31_000005_create_wallets_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('wallets')) {
            Schema::create('wallets', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->decimal('balance', 15, 2)->default(0);
                $table->string('currency', 10)->default('VND');
                $table->timestamps();
            });
        }
    }
    public function down() {
        Schema::dropIfExists('wallets');
    }
};
