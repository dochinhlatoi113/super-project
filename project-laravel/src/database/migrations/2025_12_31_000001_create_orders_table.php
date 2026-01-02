<?php
// database/migrations/2025_12_31_000001_create_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('orders')) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_code')->unique();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->decimal('total_amount', 15, 2);
                $table->string('currency', 10)->default('VND');
                $table->enum('status', ['pending', 'paid', 'cancelled', 'refunded'])->default('pending');
                $table->timestamps();
            });
        }
    }
    public function down() {
        Schema::dropIfExists('orders');
    }
};
