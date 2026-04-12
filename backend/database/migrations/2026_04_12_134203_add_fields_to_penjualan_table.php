<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('penjualan', function (Blueprint $table) {

            if (!Schema::hasColumn('penjualan', 'customer_name')) {
                $table->string('customer_name')->nullable()->after('tanggal');
            }

            if (!Schema::hasColumn('penjualan', 'order_type')) {
                $table->string('order_type')->default('Dine In')->after('customer_name');
            }

            if (!Schema::hasColumn('penjualan', 'status')) {
                $table->string('status')->default('pending')->after('order_type');
            }
        });
    }

    public function down(): void
    {
        Schema::table('penjualan', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'order_type', 'status']);
        });
    }
};