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
        // Tabel Utama History
        Schema::create('hpp_histories', function (Blueprint $table) {
            $table->id();
            $table->string('nama_menu');
            $table->integer('target_penjualan');
            $table->decimal('beban_sewa', 15, 2)->default(0);
            $table->decimal('beban_gaji', 15, 2)->default(0);
            $table->decimal('beban_lain_per_porsi', 15, 2)->default(0);
            $table->decimal('total_hpp', 15, 2);
            $table->timestamps();
        });

        // Tabel Detail Bahan (Snapshot bahan saat dihitung)
        Schema::create('hpp_history_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hpp_history_id')->constrained('hpp_histories')->onDelete('cascade');
            $table->string('nama_bahan');
            $table->decimal('harga_beli', 15, 2);
            $table->decimal('jumlah_porsi', 10, 2);
            $table->decimal('hpp_per_porsi', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hpp_histories');
    }
};
