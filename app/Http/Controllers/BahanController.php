<?php

namespace App\Http\Controllers;

use App\Models\Bahan;
use Illuminate\Http\Request;

class BahanController extends Controller
{
    public function index()
    {
        return Bahan::all();
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