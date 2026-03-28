<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu';

    protected $fillable = [
        'kategori_id',
        'nama_menu',
        'harga_jual'
    ];

    public function stokPorsi()
    {
        return $this->hasOne(StokPorsi::class, 'menu_id');
    }

    public function kategori()
    {
        return $this->belongsTo(MenuKategori::class, 'kategori_id');
    }

    public function resep()
    {
        return $this->hasMany(ResepMenu::class, 'menu_id');
    }
}