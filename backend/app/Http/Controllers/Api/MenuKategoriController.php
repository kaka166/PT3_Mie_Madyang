<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MenuKategoriController extends Controller
{
    // Ambil semua kategori
    public function index()
    {
        $kategori = DB::table('menu_kategori')->get();
        return response()->json([
            'success' => true,
            'data'    => $kategori
        ]);
    }

    // Simpan kategori baru
    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|unique:menu_kategori,nama_kategori'
        ]);

        $id = DB::table('menu_kategori')->insertGetId([
            'nama_kategori' => $request->nama_kategori,
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $kategori = DB::table('menu_kategori')->where('id', $id)->first();

        return response()->json([
            'success' => true,
            'data'    => $kategori
        ], 201);
    }

    // --- FUNGSI TOGGLE (PASTIKAN ADA DI DALAM CLASS) ---
    public function toggleStatus($id)
    {
        try {
            $kategori = DB::table('menu_kategori')->where('id', $id)->first();

            if (!$kategori) {
                return response()->json(['success' => false, 'message' => 'Kategori tidak ditemukan'], 404);
            }

            $statusBaru = ($kategori->is_active == 1) ? 0 : 1;

            DB::beginTransaction();

            // 1. Update status kategori
            DB::table('menu_kategori')->where('id', $id)->update([
                'is_active' => $statusBaru,
                'updated_at' => now()
            ]);

            // 2. Cascading: Jika kategori mati, semua menu di dalamnya IKUT MATI
            if ($statusBaru == 0) {
                DB::table('menu_kategori')->where('kategori_id', $id)->update([
                    'is_active' => 0,
                    'updated_at' => now()
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Status diperbarui',
                'data' => ['is_active' => $statusBaru]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update Nama Kategori
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_kategori' => 'required|string|unique:menu_kategori,nama_kategori,' . $id
        ]);

        DB::table('menu_kategori')->where('id', $id)->update([
            'nama_kategori' => $request->nama_kategori,
            'updated_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'data' => DB::table('menu_kategori')->where('id', $id)->first()
        ]);
    }

    // Hapus Kategori
    public function destroy($id)
    {
        DB::table('menu_kategori')->where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    //new
    public function show($id)
    {
        $kategori = DB::table('menu_kategori')->where('id', $id)->first();

        if (!$kategori) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $kategori
        ]);
    }
}