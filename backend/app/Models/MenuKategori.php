<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuKategori extends Model
{
    use HasFactory;

    protected $table = 'menu_kategori';

    protected $fillable = ['nama_kategori', 'is_active'];

    // PASTIKAN FUNGSI INI ADA
    public function menus()
    {
        return $this->hasMany(Menu::class, 'kategori_id');
    }
}