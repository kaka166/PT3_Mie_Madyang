<?php

namespace App\Http\Controllers;

use App\Models\ResepMenu;
use App\Models\Menu;
use App\Models\Bahan;
use Illuminate\Http\Request;

class ResepMenuController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role', 'owner');
        $resep = \App\Models\ResepMenu::with(['menu', 'bahan'])->get();
        return view('resep-menu.index', compact('resep', 'role'));
    }
    public function create(Request $request)
    {
        $role = $request->query('role', 'owner');
        $menu = \App\Models\Menu::all();
        $bahan = \App\Models\Bahan::all();
        return view('resep-menu.create', compact('menu', 'bahan', 'role'));
    }

    public function store(Request $request)
    {
        // ID ada di tabel asal, dan QTY wajib angka positif
        $request->validate([
            'menu_id' => 'required|exists:menu,id',
            'bahan_id' => 'required|exists:bahan,id',
            'qty' => 'required|numeric|min:0.01' // Tidak boleh 0 atau minus
        ]);

        $cekResep = ResepMenu::where('menu_id', $request->menu_id)
            ->where('bahan_id', $request->bahan_id)
            ->first();

        if ($cekResep) {
            $cekResep->qty += $request->qty;
            $cekResep->save();

            return "Bahan sudah ada di resep ini. Qty berhasil diakumulasi/diupdate.";
        }

        ResepMenu::create([
            'menu_id' => $request->menu_id,
            'bahan_id' => $request->bahan_id,
            'qty' => $request->qty
        ]);

        return "Resep berhasil ditambahkan";
    }
}
