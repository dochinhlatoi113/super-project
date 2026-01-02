<?php
// database/migrations/2025_12_31_000009_create_invoices_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('invoices')) {
            Schema::create('invoices', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id');
                $table->string('invoice_code')->unique();
                $table->decimal('total_amount', 15, 2);
                $table->string('currency', 10)->default('VND');
                $table->timestamps();
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            });
        }
    }
    public function down() {
        Schema::dropIfExists('invoices');
    }
};
