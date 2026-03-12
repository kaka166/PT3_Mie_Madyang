<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokPorsi extends Model
{
    protected $table = 'stok_porsi';

    protected $fillable = [
        'menu_id',
        'qty'
    ];

    public function stok()
    {
        return $this->hasOne(StokPorsi::class);
    }
}
