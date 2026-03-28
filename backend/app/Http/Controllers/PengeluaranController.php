<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index()
    {
        // riwayat pengeluaran sama nama user
        $pengeluaran = Pengeluaran::with('user')->get();
        return response()->json($pengeluaran);
    }

    public function store(Request $request)
    {
        // Pastikan jumlah uang valid dan tidak minus
        $request->validate([
            'nama_pengeluaran' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id',
            'tanggal' => 'required|date'
        ]);

        $pengeluaran = Pengeluaran::create([
            'nama_pengeluaran' => $request->nama_pengeluaran,
            'jumlah' => $request->jumlah,
            'user_id' => $request->user_id,
            'tanggal' => $request->tanggal
        ]);

        return response()->json([
            'message' => 'Pengeluaran operasional berhasil dicatat',
            'data' => $pengeluaran
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pengeluaran' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id',
            'tanggal' => 'required|date'
        ]);

        $pengeluaran = Pengeluaran::findOrFail($id);
        
        $pengeluaran->update([
            'nama_pengeluaran' => $request->nama_pengeluaran,
            'jumlah' => $request->jumlah,
            'user_id' => $request->user_id,
            'tanggal' => $request->tanggal
        ]);

        return response()->json([
            'message' => 'Catatan pengeluaran berhasil di-update',
            'data' => $pengeluaran
        ]);
    }

    public function destroy($id)
    {
        $pengeluaran = Pengeluaran::findOrFail($id);
        $pengeluaran->delete();

        return response()->json(['message' => 'Catatan pengeluaran berhasil dihapus']);
    }
}