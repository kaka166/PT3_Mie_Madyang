<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('stok_movements', function (Blueprint $table) {
        $table->engine = 'InnoDB';

        $table->id();
        $table->unsignedBigInteger('bahan_id');

        $table->enum('tipe', ['plus', 'minus']);
        $table->decimal('jumlah', 10, 2);
        $table->string('satuan');
        $table->string('kategori');
        $table->string('alasan')->nullable();
        $table->unsignedBigInteger('user_id')->nullable();

        $table->timestamps();

        $table->foreign('bahan_id')
            ->references('id')
            ->on('bahan')
            ->onDelete('cascade');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_movements');
    }
};
