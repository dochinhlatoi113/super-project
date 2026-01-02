<?php
// database/migrations/2025_12_31_000002_create_payments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id');
                $table->string('payment_code')->unique();
                $table->decimal('amount', 15, 2);
                $table->string('currency', 10)->default('VND');
                $table->string('payment_method'); // card, bank, momo, vnpay…
                $table->string('payment_gateway'); // VNPay, Stripe, PayPal…
                $table->enum('status', ['initiated', 'processing', 'success', 'failed'])->default('initiated');
                $table->timestamp('paid_at')->nullable();
                $table->timestamps();
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            });
        }
    }
    public function down() {
        Schema::dropIfExists('payments');
    }
};
