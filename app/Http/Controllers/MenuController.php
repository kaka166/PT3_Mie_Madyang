<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuKategori;
use Illuminate\Http\Request;

class MenuController extends Controller
{

    public function index(Request $request)
    {
        // Ambil role dari URL (?role=owner)
        $role = $request->query('role', 'owner');

        // Ambil data menu
        $menu = Menu::with('kategori')->get();

        // KIRIM KE VIEW (Ini kuncinya!)
        return view('menu.index', compact('menu', 'role'));
    }

    public function create(Request $request)
    {
        $role = $request->query('role', 'owner');

        $kategori = MenuKategori::all();

        return view('menu.create', compact('kategori', 'role'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:menu_kategori,id',
            'nama_menu' => 'required|string|max:255',
            'harga_jual' => 'required|numeric|min:0',
        ]);

        Menu::create([
            'kategori_id' => $request->kategori_id,
            'nama_menu' => $request->nama_menu,
            'harga_jual' => $request->harga_jual,
        ]);

        return redirect('/dashboard/menu?role=owner')->with('success', 'Menu berhasil ditambah!');
    }

    public function dashboardGeneral(Request $request)
    {
        $role = $request->query('role', 'owner');

        $totalTerjual = \App\Models\PenjualanDetail::whereDate('created_at', today())->sum('qty');
        $stokPorsi = \App\Models\StokPorsi::sum('qty');

        return view('dashboard', compact('role', 'totalTerjual', 'stokPorsi'));
    }
}
