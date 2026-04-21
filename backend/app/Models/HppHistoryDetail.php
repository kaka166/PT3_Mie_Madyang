<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HppHistoryDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'hpp_history_id',
        'nama_bahan',
        'harga_beli',
        'jumlah_porsi',
        'hpp_per_porsi'
    ];

    public function hppHistory()
    {
        return $this->belongsTo(HppHistory::class);
    }
}