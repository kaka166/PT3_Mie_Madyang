<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PenjualanDetail extends Model
{
    protected $table = 'penjualan_detail';

    protected $fillable = [
        'penjualan_id',
        'menu_id',
        'qty',
        'harga',
        'subtotal'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
