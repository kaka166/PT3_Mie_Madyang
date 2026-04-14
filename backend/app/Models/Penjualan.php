<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    protected $table = 'penjualan';

    protected $fillable = [
        'tanggal',
        'total',
        'user_id',
        'customer_name',
        'order_type',
        'status'
    ];

    public function detail()
    {
        return $this->hasMany(PenjualanDetail::class);
    }
}
