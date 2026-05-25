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
        $allowedKeys = ['hero_title', 'hero_subtitle', 'hero_image', 'mascot_image', 'about_title', 'about_description', 'features', 'social_links'];

        $data = $request->all();

        // Handle file uploads
        if ($request->hasFile('hero_image')) {
            $file = $request->file('hero_image');
            $filename = 'hero_image.' . $file->hashName() . '.' . $file->extension();
            $path = $file->storeAs('landing-page', $filename, 'public');
            $data['hero_image'] = '/storage/' . $path;
        }

        if ($request->hasFile('mascot_image')) {
            $file = $request->file('mascot_image');
            $filename = 'mascot_image.' . $file->hashName() . '.' . $file->extension();
            $path = $file->storeAs('landing-page', $filename, 'public');
            $data['mascot_image'] = '/storage/' . $path;
        }

        foreach ($data as $key => $value) {
            if (!in_array($key, $allowedKeys) || $key === '_method') {
                continue;
            }
            LandingPageSetting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Landing page settings updated successfully.'
        ]);
    }
}
