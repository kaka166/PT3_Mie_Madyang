<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProduksiDetail extends Model
{
    protected $table = 'produksi_detail';

    protected $fillable = [
        'produksi_id',
        'bahan_id',
        'qty',
        'harga_satuan',
        'subtotal'
    ];

    public function bahan()
    {
        return $this->belongsTo(Bahan::class);
    }

    public function produksi()
    {
        return $this->belongsTo(Produksi::class);
    }
}
