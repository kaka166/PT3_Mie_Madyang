<?php

namespace App\Http\Controllers;

use App\Models\Bahan;
use Illuminate\Http\Request;

class BahanController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role', 'owner');
        $bahan = \App\Models\Bahan::all();
        return view('bahan.index', compact('bahan', 'role'));
    }
    public function create(Request $request)
    {
        $role = $request->query('role', 'owner');
        return view('bahan.create', compact('role'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_bahan' => 'required|string',
            'satuan' => 'required|string'
        ]);

        Bahan::create([
            'nama_bahan' => $request->nama_bahan,
            'satuan' => $request->satuan
        ]);

        return "bahan berhasil ditambahkan";
    }
}
