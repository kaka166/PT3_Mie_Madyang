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
        Schema::create('produksi_detail', function (Blueprint $table) {
            $table->id();

            $table->foreignId('produksi_id')
                ->constrained('produksi')
                ->cascadeOnDelete();

            $table->foreignId('bahan_id')
                ->constrained('bahan')
                ->cascadeOnDelete();

            $table->decimal('qty', 12, 2);
            $table->decimal('harga_satuan', 12, 2);
            $table->decimal('subtotal', 12, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produksi_detail');
    }
};
