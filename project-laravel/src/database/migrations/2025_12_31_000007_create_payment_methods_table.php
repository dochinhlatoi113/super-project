<?php
// database/migrations/2025_12_31_000007_create_payment_methods_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('payment_methods')) {
            Schema::create('payment_methods', function (Blueprint $table) {
                $table->id();
                $table->string('code')->unique(); // momo, vnpay, visa
                $table->string('name');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }
    public function down() {
        Schema::dropIfExists('payment_methods');
    }
};
