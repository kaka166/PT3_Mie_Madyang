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
        Schema::create('pembelian_bahan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('bahan_id')
                ->constrained('bahan')
                ->cascadeOnDelete();

            $table->decimal('qty', 12, 2);

            $table->decimal('harga_total', 12, 2);

            $table->decimal('harga_per_satuan', 12, 2);

            $table->date('tanggal');

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembelian_bahan');
    }
};
