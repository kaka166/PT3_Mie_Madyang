<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu';

    protected $fillable = [
        'nama_menu',
        'kategori_id',
        'harga_jual'
    ];

    public function kategori()
    {
        return $this->belongsTo(MenuKategori::class, 'kategori_id');
    }

    public function resep()
    {
        return $this->hasMany(ResepMenu::class);
    }
}
