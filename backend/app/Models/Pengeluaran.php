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
        'session_id',
        'tanggal',
        'kategori',
        'deskripsi',
        'evidence_file',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function session()
    {
        return $this->belongsTo(PosSession::class, 'session_id');
    }
}