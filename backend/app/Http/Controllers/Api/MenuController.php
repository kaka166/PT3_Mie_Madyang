<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\MenuKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // GET /api/menu
    public function index()
    {
        $menu = Menu::with('kategori', 'stokPorsi')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar menu',
            'data' => $menu->map(function ($m) {
                return [
                    'id' => $m->id,
                    'nama_menu' => $m->nama_menu,
                    'harga_jual' => $m->harga_jual,
                    'gambar' => $m->gambar,
                    'is_active' => $m->is_active,
                    'kategori' => $m->kategori,
                    'stock' => $m->stokPorsi->qty ?? 0,
                ];
            })
        ]);
    }

    // GET /api/menu/{id}
    public function show($id)
    {
        $menu = Menu::with('kategori')->find($id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $menu
        ]);
    }

    // POST /api/menu
    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:menu_kategori,id',
            'nama_menu' => 'required',
            'harga_jual' => 'required',
            'gambar' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $namaFile = null;

        if ($request->hasFile('gambar')) {
            $namaFile = time() . '.' . $request->gambar->extension();
            $request->gambar->storeAs('menu', $namaFile, 'public');
        }

        $menu = Menu::create([
            'kategori_id' => $request->kategori_id,
            'nama_menu' => $request->nama_menu,
            'harga_jual' => $request->harga_jual,
            'gambar' => $namaFile,
            'deskripsi' => $request->deskripsi,
            'is_featured' => $request->is_featured ?? 0,
            'is_active' => 1 // default tampil di POS
        ]);

        return response()->json([
            'success' => true,
            'data' => $menu
        ]);
    }

    // PUT /api/menu/{id}
    public function update(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan'
            ], 404);
        }

        // =========================
        // JIKA HANYA TOGGLE POS
        // =========================
        if ($request->has('is_active') && !$request->has('nama_menu')) {
            $menu->is_active = $request->is_active;
            $menu->save();

            return response()->json([
                'success' => true,
                'message' => 'Status POS berhasil diubah',
                'data' => $menu
            ]);
        }

        // =========================
        // JIKA EDIT MENU
        // =========================
        $request->validate([
            'kategori_id' => 'required|exists:menu_kategori,id',
            'nama_menu' => 'required|string|max:255',
            'harga_jual' => 'required|numeric|min:0',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $menu->kategori_id = $request->kategori_id;
        $menu->nama_menu = $request->nama_menu;
        $menu->harga_jual = $request->harga_jual;

        if ($request->hasFile('gambar')) {
            $namaFile = time() . '.' . $request->gambar->extension();
            $request->gambar->storeAs('menu', $namaFile, 'public');
            $menu->gambar = $namaFile;
        }

        $menu->save();

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil diupdate',
            'data' => $menu
        ]);
    }

    // DELETE /api/menu/{id}
    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Menu tidak ditemukan'
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil dihapus'
        ]);
    }

    // GET /api/kategori
    public function kategori()
    {
        $kategori = MenuKategori::all();

        return response()->json([
            'success' => true,
            'data' => $kategori
        ]);
    }

    public function toggle($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->is_active = !$menu->is_active;
        $menu->save();

        return response()->json([
            'message' => 'Status menu berhasil diubah',
            'is_active' => $menu->is_active
        ]);
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0'
        ]);

        $menu = Menu::findOrFail($id);

        $stok = \App\Models\StokPorsi::firstOrCreate(
            ['menu_id' => $menu->id],
            ['qty' => 0]
        );

        $stok->qty = $request->stock;
        $stok->save();

        return response()->json([
            'message' => 'Stok berhasil diupdate'
        ]);
    }
}
