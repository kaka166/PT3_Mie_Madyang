<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosSession extends Model
{
    protected $fillable = [
        'user_id',
        'started_at',
        'ended_at',
        'opening_cash',   
        'closing_cash',
        'total_pemasukan',
        'total_pengeluaran'
    ];

    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'session_id');
    }
}