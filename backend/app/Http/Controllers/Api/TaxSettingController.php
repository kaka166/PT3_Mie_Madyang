<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaxSetting;
use Illuminate\Http\Request;

class TaxSettingController extends Controller
{
    public function get()
    {
        $tax = TaxSetting::first();

        if (!$tax) {
            $tax = TaxSetting::create([
                'is_enabled' => true,
                'tax_percent' => 11
            ]);
        }

        return response()->json($tax);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'is_enabled' => 'required|boolean',
            'tax_percent' => 'required|integer|min:0|max:100',
        ]);

        $tax = TaxSetting::first() ?? new TaxSetting();

        $tax->is_enabled = $validated['is_enabled'];
        $tax->tax_percent = $validated['tax_percent'];
        $tax->save();

        return response()->json($tax);
    }
}