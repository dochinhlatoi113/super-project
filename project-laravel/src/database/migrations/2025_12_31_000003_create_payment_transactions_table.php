<?php
// database/migrations/2025_12_31_000003_create_payment_transactions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('payment_transactions')) {
            Schema::create('payment_transactions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('payment_id');
                $table->string('gateway_transaction_id')->nullable();
                $table->json('request_payload')->nullable();
                $table->json('response_payload')->nullable();
                $table->string('status')->nullable();
                $table->timestamps();
                $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade');
            });
        }
    }
    public function down() {
        Schema::dropIfExists('payment_transactions');
    }
};
