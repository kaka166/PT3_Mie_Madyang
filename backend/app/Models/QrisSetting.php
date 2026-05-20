<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrisSetting extends Model
{
    protected $table = 'qris_settings';

    protected $fillable = [
        'nama_bank',
        'nama_pemilik',
        'no_rekening',
        'gambar_qris',
        'is_active',
    ];
}
