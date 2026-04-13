<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxSetting extends Model
{
    protected $fillable = [
        'is_enabled',
        'tax_percent',
    ];

    protected $casts = [
    'is_enabled' => 'boolean',
    'tax_percent' => 'integer',
    ];
}
