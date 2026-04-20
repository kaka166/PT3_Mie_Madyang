<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produksi extends Model
{
    protected $table = 'produksi';

    protected $fillable = [
        'menu_id',
        'tanggal_produksi',
        'jumlah_porsi',
        'hpp_per_porsi',
        'created_by'
    ];

    public function details()
    {
        return $this->hasMany(ProduksiDetail::class);
    }
    
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
