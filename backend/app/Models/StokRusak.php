<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokRusak extends Model
{
    protected $table = 'stok_rusak';

    protected $fillable = [
        'menu_id',
        'qty',
        'alasan',
        'tanggal'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }
}