<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HppHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_menu',
        'target_penjualan',
        'beban_sewa',
        'beban_gaji',
        'beban_lain_per_porsi',
        'total_hpp'
    ];

    public function details()
    {
        return $this->hasMany(HppHistoryDetail::class);
    }
}