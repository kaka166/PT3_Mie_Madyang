<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengeluaran', function (Blueprint $table) {
            $table->string('kategori')->default('Operasional')->after('nama_pengeluaran');
            $table->text('deskripsi')->nullable()->after('kategori');
            $table->string('evidence_file')->nullable()->after('deskripsi');
        });

        Schema::table('pemasukan', function (Blueprint $table) {
            $table->string('evidence_file')->nullable()->after('waktu');
        });
    }

    public function down(): void
    {
        Schema::table('pengeluaran', function (Blueprint $table) {
            $table->dropColumn(['kategori', 'deskripsi', 'evidence_file']);
        });

        Schema::table('pemasukan', function (Blueprint $table) {
            $table->dropColumn('evidence_file');
        });
    }
};
