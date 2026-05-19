<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $records = DB::table('pemasukan')
            ->whereNull('kasir')
            ->orWhere('kasir', 'Unknown')
            ->get();

        foreach ($records as $p) {
            $penjualan = DB::table('penjualan')->where('id', $p->penjualan_id)->first();
            if (!$penjualan) continue;

            $user = DB::table('users')->where('id', $penjualan->user_id)->first();
            $nama = $user ? $user->name : 'Unknown';

            DB::table('pemasukan')
                ->where('id', $p->id)
                ->update(['kasir' => $nama]);
        }
    }

    public function down(): void
    {
        // no rollback — data fix is irreversible
    }
};
