<?php

namespace App\Models;


use App\Models\User;
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
        'status',
        'metode_pembayaran'
    ];

    public function detail()
    {
        return $this->hasMany(PenjualanDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
