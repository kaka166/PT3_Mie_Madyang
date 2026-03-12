<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\MenuKategori;
use App\Models\Menu;
use App\Models\StokPorsi;
use App\Models\Penjualan;
use App\Models\User; // JANGAN LUPA IMPORT MODEL USER

class PenjualanTest extends TestCase
{
    use RefreshDatabase; 

    // Bikin function bantuan biar nggak nulis ulang kode user
    private function siapkanDataUser()
    {
        return User::create([
            'id' => 1,
            'name' => 'Kasir Testing',
            'email' => 'kasir@test.com',
            'password' => bcrypt('123456'),
            'role' => 'kasir'
        ]);
    }

    public function test_transaksi_penjualan_berhasil_memotong_stok_dan_mencatat_total()
    {
        // 1. ARRANGE
        $this->siapkanDataUser(); // Panggil si User ID 1

        $kategori = MenuKategori::create(['nama_kategori' => 'Mie']);
        $menu = Menu::create([
            'nama_menu' => 'Mie Ayam Spesial',
            'kategori_id' => $kategori->id,
            'harga_jual' => 15000
        ]);

        StokPorsi::create([
            'menu_id' => $menu->id,
            'qty' => 10 
        ]);

        $payload = [
            'pesanan' => [
                [
                    'menu_id' => $menu->id,
                    'qty' => 2 
                ]
            ]
        ];

        // 2. ACT
        $response = $this->postJson('/admin/penjualan', $payload);

        // 💡 TIPS DEBUGGING: Kalau masih error, hapus tanda komentar di bawah ini
        // untuk melihat error 500-nya gara-gara apa:
        $response->dump();

        // 3. ASSERT
        $response->assertStatus(201);

        $this->assertDatabaseHas('stok_porsi', [
            'menu_id' => $menu->id,
            'qty' => 8
        ]);

        $this->assertDatabaseHas('penjualan', [
            'total' => 30000,
            'user_id' => 1 
        ]);

        $this->assertDatabaseHas('penjualan_detail', [
            'menu_id' => $menu->id,
            'qty' => 2,
            'harga' => 15000,
            'subtotal' => 30000
        ]);
    }

    public function test_penjualan_gagal_jika_stok_tidak_cukup()
    {
        // 1. ARRANGE
        $this->siapkanDataUser(); // Panggil si User ID 1 lagi karena RefreshDatabase mengosongkan ulang data

        $kategori = MenuKategori::create(['nama_kategori' => 'Minuman']);
        $menu = Menu::create([
            'nama_menu' => 'Es Teh',
            'kategori_id' => $kategori->id,
            'harga_jual' => 5000
        ]);
        
        StokPorsi::create([
            'menu_id' => $menu->id,
            'qty' => 1 
        ]);

        $payload = [
            'pesanan' => [
                [
                    'menu_id' => $menu->id,
                    'qty' => 5
                ]
            ]
        ];

        // 2. ACT
        $response = $this->postJson('/admin/penjualan', $payload);

        // 3. ASSERT
        $response->assertStatus(400);

        $this->assertDatabaseHas('stok_porsi', [
            'menu_id' => $menu->id,
            'qty' => 1
        ]);
    }
}