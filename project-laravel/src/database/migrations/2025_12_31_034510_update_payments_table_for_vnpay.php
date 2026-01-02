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
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->string('order_id')->change();
            $table->unsignedBigInteger('payment_method_id')->nullable()->after('order_id');
            $table->string('transaction_id')->nullable()->after('payment_method_id');
            $table->string('vnpay_transaction_no')->nullable()->after('transaction_id');
            $table->string('vnpay_response_code')->nullable()->after('vnpay_transaction_no');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['payment_method_id', 'transaction_id', 'vnpay_transaction_no', 'vnpay_response_code']);
            $table->unsignedBigInteger('order_id')->change();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }
};
