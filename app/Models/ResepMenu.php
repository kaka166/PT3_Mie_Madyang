<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResepMenu extends Model
{
    protected $table = 'resep_menu';

    protected $fillable = [
        'menu_id',
        'bahan_id',
        'qty'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function bahan()
    {
        return $this->belongsTo(Bahan::class);
    }
}
