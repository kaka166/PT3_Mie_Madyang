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
        $menu = Menu::with('kategori')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar menu',
            'data' => $menu
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

        $request->validate([
            'kategori_id' => 'required|exists:menu_kategori,id',
            'nama_menu' => 'required|string|max:255',
            'harga_jual' => 'required|numeric|min:0',
        ]);

        $menu->update([
            'kategori_id' => $request->kategori_id,
            'nama_menu' => $request->nama_menu,
            'harga_jual' => $request->harga_jual,
        ]);

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
}
