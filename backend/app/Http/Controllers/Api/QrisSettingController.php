<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QrisSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QrisSettingController extends Controller
{
    public function index()
    {
        $settings = QrisSetting::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_bank' => 'nullable|string|max:255',
            'nama_pemilik' => 'nullable|string|max:255',
            'no_rekening' => 'nullable|string|max:100',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['nama_bank', 'nama_pemilik', 'no_rekening', 'is_active']);

        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('qris', $filename, 'public');
            $data['gambar_qris'] = $filename;
        }

        $setting = QrisSetting::create($data);

        return response()->json([
            'success' => true,
            'message' => 'QRIS setting berhasil ditambahkan',
            'data' => $setting
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $setting = QrisSetting::findOrFail($id);

        $request->validate([
            'nama_bank' => 'nullable|string|max:255',
            'nama_pemilik' => 'nullable|string|max:255',
            'no_rekening' => 'nullable|string|max:100',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'is_active' => 'boolean',
        ]);

        $data = $request->only(['nama_bank', 'nama_pemilik', 'no_rekening', 'is_active']);

        if ($request->hasFile('gambar')) {
            if ($setting->gambar_qris) {
                Storage::disk('public')->delete('qris/' . $setting->gambar_qris);
            }
            $file = $request->file('gambar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('qris', $filename, 'public');
            $data['gambar_qris'] = $filename;
        }

        $setting->update($data);

        return response()->json([
            'success' => true,
            'message' => 'QRIS setting berhasil diupdate',
            'data' => $setting
        ]);
    }

    public function destroy($id)
    {
        $setting = QrisSetting::findOrFail($id);
        if ($setting->gambar_qris) {
            Storage::disk('public')->delete('qris/' . $setting->gambar_qris);
        }
        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'QRIS setting berhasil dihapus'
        ]);
    }
}
