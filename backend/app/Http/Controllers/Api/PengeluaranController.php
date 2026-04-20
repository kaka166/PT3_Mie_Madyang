<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Support\Facades\Auth;

class PengeluaranController extends Controller
{
    public function index()
    {
        $data = Pengeluaran::latest()->get()->map(function ($item) {
            return [
                'id' => '#' . str_pad($item->id, 5, '0', STR_PAD_LEFT),
                'nama' => $item->nama_pengeluaran,
                'kategori' => 'Bahan Baku',
                'user_id' => $item->user->name ?? 'Unknown',
                'waktu' => $item->tanggal,
                'jumlah' => $item->jumlah,
            ];
        });

        return response()->json($data);
    }
}