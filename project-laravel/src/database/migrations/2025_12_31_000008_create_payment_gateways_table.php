<?php
// database/migrations/2025_12_31_000008_create_payment_gateways_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        if (!Schema::hasTable('payment_gateways')) {
            Schema::create('payment_gateways', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->json('config'); // api_key, secret, ...
                $table->enum('environment', ['sandbox', 'prod'])->default('sandbox');
                $table->timestamps();
            });
        }
    }
    public function down() {
        Schema::dropIfExists('payment_gateways');
    }
};
