<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokMovement extends Model
{
    protected $fillable = [
        'bahan_id',
        'tipe',
        'jumlah',
        'satuan',
        'kategori',
        'alasan',
        'user_id'
    ];
}
