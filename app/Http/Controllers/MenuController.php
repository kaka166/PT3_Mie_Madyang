<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuKategori;
use Illuminate\Http\Request;

class MenuController extends Controller
{

    public function index()
    {
        $menu = Menu::with('kategori')->get();
        return response()->json($menu);
    }

    public function create()
    {
        $kategori = MenuKategori::all();
        return response()->json($kategori);
    }

    public function store(Request $request)
    {
        Menu::create([
            'nama_menu' => $request->nama_menu,
            'kategori_id' => $request->kategori_id,
            'harga_jual' => $request->harga_jual
        ]);

        return "Menu berhasil ditambahkan";
    }

}
