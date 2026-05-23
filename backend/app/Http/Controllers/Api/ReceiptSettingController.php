<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReceiptSetting;

class ReceiptSettingController extends Controller
{
    public function index()
    {
        $settings = ReceiptSetting::pluck('value', 'key');
        
        // Sediakan nilai default jika kosong
        $defaults = [
            'store_name' => 'MIE MA-DYANG',
            'store_motto' => 'The Culinary Curator',
            'store_address' => 'Jl. Raya Madyang No. 16, Malang',
            'store_phone' => '0812-3456-7890',
            'footer_msg1' => 'Terima kasih!',
            'footer_msg2' => 'Selamat menikmati :)',
        ];

        foreach ($defaults as $key => $default) {
            if (!isset($settings[$key])) {
                $settings[$key] = $default;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->all();

        foreach ($data as $key => $value) {
            if (is_string($value) || is_numeric($value) || is_null($value)) {
                ReceiptSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan nota berhasil disimpan.'
        ]);
    }
}
