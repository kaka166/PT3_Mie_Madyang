<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bahan', function (Blueprint $table) {
            $table->decimal('harga', 15, 2)->default(0); // ✅ TAMBAH INI
        });
    }

    public function down()
    {
        Schema::table('bahan', function (Blueprint $table) {
            $table->dropColumn('harga');
        });
    }
};
