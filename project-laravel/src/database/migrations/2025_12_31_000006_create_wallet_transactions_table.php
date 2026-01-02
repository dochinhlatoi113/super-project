<?php
// database/migrations/2025_12_31_000006_create_wallet_transactions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('wallet_transactions')) {
            Schema::create('wallet_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('wallet_id');
                $table->enum('type', ['credit', 'debit']);
                $table->decimal('amount', 15, 2);
                $table->string('reference_type'); // order/payment/refund
                $table->unsignedBigInteger('reference_id');
                $table->decimal('balance_after', 15, 2);
                $table->timestamps();
                $table->foreign('wallet_id')->references('id')->on('wallets')->onDelete('cascade');
            });
        }
    }
    public function down() {
        Schema::dropIfExists('wallet_transactions');
    }
};
