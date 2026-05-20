<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LandingPageSetting;

class LandingPageSettingController extends Controller
{
    public function index()
    {
        $settings = LandingPageSetting::pluck('value', 'key');
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->all();

        // Handle file uploads
        if ($request->hasFile('hero_image')) {
            $file = $request->file('hero_image');
            $path = $file->storeAs('landing-page', 'hero_image.' . $file->extension(), 'public');
            $data['hero_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('mascot_image')) {
            $file = $request->file('mascot_image');
            $path = $file->storeAs('landing-page', 'mascot_image.' . $file->extension(), 'public');
            $data['mascot_image'] = '/storage/' . $path;
        }

        foreach ($data as $key => $value) {
            if ($key !== '_method' && (is_string($value) || is_numeric($value))) {
                LandingPageSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Landing page settings updated successfully.'
        ]);
    }
}
