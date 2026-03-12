<?php

namespace App\Http\Controllers;

use App\Models\MenuKategori;
use Illuminate\Http\Request;

class MenuKategoriController extends Controller
{

    public function index()
    {
        $kategori = MenuKategori::all();
        return view('kategori-menu.index', compact('kategori'));
    }

    public function create()
    {
        return view('kategori-menu.create');
    }

    public function store(Request $request)
    { 
        MenuKategori::create([
            'nama_kategori' => $request->nama_kategori
        ]);

        return redirect()->route('kategori-menu.index');
    }
}
