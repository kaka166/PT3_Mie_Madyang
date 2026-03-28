<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    protected $table = 'pengeluaran';

    protected $fillable = [
        'nama_pengeluaran',
        'jumlah',
        'user_id',
        'tanggal'
    ];

    // Relasi ke tabel users (Dapur/Kasir mana yang input)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}