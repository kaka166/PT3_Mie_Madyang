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
        Schema::create('resep_menu', function (Blueprint $table) {
            $table->id();

            $table->foreignId('menu_id')
                ->constrained('menu')
                ->cascadeOnDelete();

            $table->foreignId('bahan_id')
                ->constrained('bahan')
                ->cascadeOnDelete();

            $table->decimal('qty', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resep_menu');
    }
};
