<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KonsultasiController extends Controller
{
    public function index(Request $request)
    {
        $role = $request->query('role', 'owner');
        return view('konsultasi.index', compact('role'));
    }
}
