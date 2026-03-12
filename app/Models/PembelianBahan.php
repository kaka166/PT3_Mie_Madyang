<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PembelianBahan extends Model
{
    protected $table = 'pembelian_bahan';

    protected $fillable = [
        'bahan_id',
        'qty',
        'harga_total',
        'harga_per_satuan',
        'user_id',
        'tanggal'
    ];

    public function bahan()
    {
        return $this->belongsTo(Bahan::class);
    }
}
