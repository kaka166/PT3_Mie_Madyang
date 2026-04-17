<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemasukan extends Model
{
    protected $table = 'pemasukan';

    protected $fillable = [
        'penjualan_id',
        'nama',
        'total',
        'kasir',
        'metode',
        'waktu'
    ];
}
