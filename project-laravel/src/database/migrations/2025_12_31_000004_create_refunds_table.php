<?php
// database/migrations/2025_12_31_000004_create_refunds_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('refunds')) {
            Schema::create('refunds', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('payment_id');
                $table->string('refund_code')->unique();
                $table->decimal('amount', 15, 2);
                $table->string('reason')->nullable();
                $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
                $table->timestamp('refunded_at')->nullable();
                $table->timestamps();
                $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade');
            });
        }
    }
    public function down() {
        Schema::dropIfExists('refunds');
    }
};
