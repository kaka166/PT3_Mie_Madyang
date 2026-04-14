<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StokBahan extends Model
{
    protected $table = 'stok_bahan';

    protected $fillable = [
        'bahan_id',
        'qty'
    ];

    // ==========================
    // RELATION
    // ==========================
    public function bahan()
    {
        return $this->belongsTo(Bahan::class, 'bahan_id');
    }
}