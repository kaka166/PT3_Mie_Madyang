<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bahan', function (Blueprint $table) {
            $table->integer('stock_limit')->default(5);
        });
    }

    public function down()
    {
        Schema::table('bahan', function (Blueprint $table) {
            $table->dropColumn('stock_limit');
        });
    }
};
