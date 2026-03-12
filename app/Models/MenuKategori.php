<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuKategori extends Model
{
    protected $table = 'menu_kategori';

    protected $fillable = [
        'nama_kategori'
    ];
}
