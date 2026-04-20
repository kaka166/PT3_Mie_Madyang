<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bahan extends Model
{
    protected $table = 'bahan';

    protected $fillable = [
        'nama_bahan',
        'satuan',
        'harga'
    ];

    public function resep()
    {
        return $this->hasMany(ResepMenu::class);
    }

    public function stok()
    {
        return $this->hasOne(StokBahan::class);
    }
}
