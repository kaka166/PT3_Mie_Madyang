<?php

namespace App\Annotations;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Ma-Dyang API",
 *     description="API Dokumentasi untuk sistem kasir dan manajemen restoran Mie Madyang"
 * )
 * @OA\Server(
 *     url="https://api.sixseventh.my.id",
 *     description="Production Server"
 * )
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Local Development"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     description="Masukkan token Bearer dari response login"
 * )
 */
class OpenApiSpec
{
}

/**
 * @OA\Schema(schema="LoginRequest",
 *     @OA\Property(property="login", type="string", description="Username atau Email"),
 *     @OA\Property(property="password", type="string", description="Password")
 * )
 * @OA\Schema(schema="LoginResponse",
 *     @OA\Property(property="status", type="string", example="success"),
 *     @OA\Property(property="data", type="object",
 *         @OA\Property(property="token", type="string", example="1|abc123..."),
 *         @OA\Property(property="user", ref="#/components/schemas/User")
 *     )
 * )
 * @OA\Schema(schema="RegisterRequest",
 *     @OA\Property(property="username", type="string"),
 *     @OA\Property(property="fullName", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone", type="string", nullable=true),
 *     @OA\Property(property="password", type="string", minLength=8),
 *     @OA\Property(property="role", type="integer", enum={1,2,3}, nullable=true)
 * )
 * @OA\Schema(schema="User",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="username", type="string"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", format="email"),
 *     @OA\Property(property="phone", type="string", nullable=true),
 *     @OA\Property(property="role", type="integer", description="1=Owner, 2=Kasir, 3=Dapur"),
 *     @OA\Property(property="email_verified_at", type="string", nullable=true),
 *     @OA\Property(property="created_at", type="string"),
 *     @OA\Property(property="updated_at", type="string")
 * )
 * @OA\Schema(schema="Menu",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="kategori_id", type="integer"),
 *     @OA\Property(property="nama_menu", type="string"),
 *     @OA\Property(property="harga_jual", type="integer"),
 *     @OA\Property(property="gambar", type="string", nullable=true),
 *     @OA\Property(property="is_active", type="boolean"),
 *     @OA\Property(property="is_fast_moving", type="boolean"),
 *     @OA\Property(property="deskripsi", type="string", nullable=true),
 *     @OA\Property(property="kategori", ref="#/components/schemas/Kategori"),
 *     @OA\Property(property="stock", type="integer", description="Stok porsi tersedia")
 * )
 * @OA\Schema(schema="Kategori",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="nama_kategori", type="string"),
 *     @OA\Property(property="is_active", type="boolean")
 * )
 * @OA\Schema(schema="Order",
 *     @OA\Property(property="id", type="string", description="Nomor transaksi (padded)"),
 *     @OA\Property(property="original_id", type="integer"),
 *     @OA\Property(property="waktu", type="string"),
 *     @OA\Property(property="customer", type="string"),
 *     @OA\Property(property="items", type="integer", description="Total item qty"),
 *     @OA\Property(property="harga", type="integer"),
 *     @OA\Property(property="kondisi", type="string", enum={"Makan Disini", "Bungkus"}),
 *     @OA\Property(property="status", type="string", enum={"Antri", "Dimasak", "Ready"}),
 *     @OA\Property(property="details", type="array", @OA\Items(ref="#/components/schemas/OrderDetail"))
 * )
 * @OA\Schema(schema="OrderDetail",
 *     @OA\Property(property="nama", type="string"),
 *     @OA\Property(property="qty", type="integer"),
 *     @OA\Property(property="note", type="string")
 * )
 * @OA\Schema(schema="CreateOrderRequest",
 *     @OA\Property(property="items", type="array", @OA\Items(type="object",
 *         @OA\Property(property="menu_id", type="integer"),
 *         @OA\Property(property="qty", type="integer"),
 *         @OA\Property(property="note", type="string", nullable=true)
 *     )),
 *     @OA\Property(property="customer_name", type="string", nullable=true),
 *     @OA\Property(property="order_type", type="string", enum={"Dine In", "Take Away"}),
 *     @OA\Property(property="metode_pembayaran", type="string", enum={"QRIS", "Tunai"})
 * )
 * @OA\Schema(schema="Bahan",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="nama", type="string"),
 *     @OA\Property(property="satuan", type="string"),
 *     @OA\Property(property="qty", type="integer"),
 *     @OA\Property(property="stock_limit", type="integer"),
 *     @OA\Property(property="harga", type="integer")
 * )
 * @OA\Schema(schema="Session",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="user_id", type="integer"),
 *     @OA\Property(property="started_at", type="string"),
 *     @OA\Property(property="ended_at", type="string", nullable=true),
 *     @OA\Property(property="opening_cash", type="integer"),
 *     @OA\Property(property="closing_cash", type="integer", nullable=true),
 *     @OA\Property(property="total_pemasukan", type="integer", nullable=true),
 *     @OA\Property(property="total_pengeluaran", type="integer", nullable=true)
 * )
 * @OA\Schema(schema="Pengeluaran",
 *     @OA\Property(property="id", type="string", description="Padded ID"),
 *     @OA\Property(property="nama", type="string"),
 *     @OA\Property(property="kategori", type="string"),
 *     @OA\Property(property="deskripsi", type="string"),
 *     @OA\Property(property="user_id", type="string", description="Nama user"),
 *     @OA\Property(property="waktu", type="string"),
 *     @OA\Property(property="jumlah", type="integer"),
 *     @OA\Property(property="evidence_file", type="string", nullable=true)
 * )
 * @OA\Schema(schema="Attendance",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="user_id", type="integer"),
 *     @OA\Property(property="tanggal", type="string", format="date"),
 *     @OA\Property(property="jam_masuk", type="string"),
 *     @OA\Property(property="jam_keluar", type="string", nullable=true),
 *     @OA\Property(property="status", type="string", enum={"hadir", "izin", "sakit"}),
 *     @OA\Property(property="keterangan", type="string", nullable=true)
 * )
 * @OA\Schema(schema="ErrorResponse",
 *     @OA\Property(property="status", type="string", example="error"),
 *     @OA\Property(property="message", type="string"),
 *     @OA\Property(property="errors", type="object", nullable=true)
 * )
 */
class OpenApiSchemas {}

/**
 * Endpoint definitions
 */
class OpenApiEndpoints
{
    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Login user",
     *     tags={"Auth"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/LoginRequest")),
     *     @OA\Response(response=200, description="Login berhasil", @OA\JsonContent(ref="#/components/schemas/LoginResponse")),
     *     @OA\Response(response=422, description="Validasi gagal"),
     *     @OA\Response(response=401, description="Kredensial salah")
     * )
     * @OA\Post(
     *     path="/api/register",
     *     summary="Register user baru",
     *     tags={"Auth"},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/RegisterRequest")),
     *     @OA\Response(response=201, description="User berhasil didaftarkan"),
     *     @OA\Response(response=422, description="Validasi gagal")
     * )
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Logout (hapus token)",
     *     tags={"Auth"},
     *     security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Berhasil logout"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     * @OA\Get(
     *     path="/api/landing-page",
     *     summary="Ambil setting landing page (public)",
     *     tags={"Settings"},
     *     @OA\Response(response=200, description="Setting landing page")
     * )
     */
    public function auth() {}

    /**
     * @OA\Get(
     *     path="/api/menu",
     *     summary="Daftar semua menu",
     *     tags={"Menu"},
     *     security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar menu", @OA\JsonContent(
     *         @OA\Property(property="success", type="boolean"),
     *         @OA\Property(property="message", type="string"),
     *         @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Menu"))
     *     ))
     * )
     * @OA\Get(path="/api/menu/{id}", summary="Detail menu", tags={"Menu"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Detail menu"),
     *     @OA\Response(response=404, description="Menu tidak ditemukan"))
     * @OA\Post(path="/api/menu", summary="Tambah menu baru", tags={"Menu"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(
     *         @OA\Property(property="kategori_id", type="integer"),
     *         @OA\Property(property="nama_menu", type="string"),
     *         @OA\Property(property="harga_jual", type="integer"),
     *         @OA\Property(property="deskripsi", type="string", nullable=true),
     *         @OA\Property(property="is_featured", type="boolean", nullable=true),
     *         @OA\Property(property="is_fast_moving", type="boolean", nullable=true),
     *         @OA\Property(property="gambar", type="string", format="binary", nullable=true)))),
     *     @OA\Response(response=200, description="Menu berhasil dibuat"),
     *     @OA\Response(response=422, description="Validasi gagal"))
     * @OA\Put(path="/api/menu/{id}", summary="Update menu", tags={"Menu"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(
     *         @OA\Property(property="kategori_id", type="integer"),
     *         @OA\Property(property="nama_menu", type="string"),
     *         @OA\Property(property="harga_jual", type="integer"),
     *         @OA\Property(property="is_fast_moving", type="boolean", nullable=true),
     *         @OA\Property(property="gambar", type="string", format="binary", nullable=true)))),
     *     @OA\Response(response=200, description="Menu berhasil diupdate"),
     *     @OA\Response(response=404, description="Menu tidak ditemukan"))
     * @OA\Delete(path="/api/menu/{id}", summary="Hapus menu", tags={"Menu"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Menu berhasil dihapus"),
     *     @OA\Response(response=404, description="Menu tidak ditemukan"))
     * @OA\Put(path="/api/menu/{id}/toggle", summary="Toggle status aktif menu", tags={"Menu"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Status berhasil diubah"))
     * @OA\Patch(path="/api/menu/{id}/stock", summary="Update stok porsi menu", tags={"Menu"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(@OA\Property(property="stock", type="integer"))),
     *     @OA\Response(response=200, description="Stok berhasil diupdate"))
     */
    public function menu() {}

    /**
     * @OA\Get(path="/api/kategori", summary="Daftar semua kategori", tags={"Kategori"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar kategori"))
     * @OA\Get(path="/api/kategori/{id}", summary="Detail kategori", tags={"Kategori"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Detail kategori"),
     *     @OA\Response(response=404, description="Tidak ditemukan"))
     * @OA\Post(path="/api/kategori", summary="Tambah kategori", tags={"Kategori"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="nama_kategori", type="string"))),
     *     @OA\Response(response=201, description="Kategori berhasil dibuat"))
     * @OA\Put(path="/api/kategori/{id}", summary="Update nama kategori", tags={"Kategori"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(@OA\Property(property="nama_kategori", type="string"))),
     *     @OA\Response(response=200, description="Kategori berhasil diupdate"))
     * @OA\Delete(path="/api/kategori/{id}", summary="Hapus kategori", tags={"Kategori"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Kategori berhasil dihapus"),
     *     @OA\Response(response=400, description="Kategori masih memiliki menu"))
     * @OA\Put(path="/api/kategori/{id}/toggle", summary="Toggle status aktif kategori", tags={"Kategori"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Status berhasil diperbarui"))
     */
    public function kategori() {}

    /**
     * @OA\Get(path="/api/orders", summary="Daftar pesanan (untuk dapur)", tags={"Orders"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar pesanan", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Order"))))
     * @OA\Post(path="/api/orders", summary="Buat pesanan baru (oleh kasir)", tags={"Orders"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/CreateOrderRequest")),
     *     @OA\Response(response=201, description="Pesanan berhasil dibuat"),
     *     @OA\Response(response=400, description="Error: stok/sesi/menu tidak valid"))
     * @OA\Patch(path="/api/orders/{id}/status", summary="Update status pesanan (oleh dapur)", tags={"Orders"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(@OA\Property(property="status", type="string", enum={"pending","cooking","done"}))),
     *     @OA\Response(response=200, description="Status updated"))
     * @OA\Get(path="/api/pemasukan", summary="Daftar pemasukan (transaksi selesai)", tags={"Orders"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="session_id", in="query", required=false, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Daftar pemasukan"))
     */
    public function orders() {}

    /**
     * @OA\Post(path="/api/users", summary="Tambah user baru (Admin only)", tags={"Users"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         @OA\Property(property="username", type="string"),
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="email", type="string", format="email"),
     *         @OA\Property(property="password", type="string", minLength=8),
     *         @OA\Property(property="role", type="integer", enum={1,2,3}),
     *         @OA\Property(property="phone", type="string", nullable=true)
     *     )),
     *     @OA\Response(response=201, description="User berhasil dibuat"),
     *     @OA\Response(response=422, description="Validasi gagal"))
     * @OA\Put(path="/api/users/{id}", summary="Update user (Admin only)", tags={"Users"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="username", type="string"),
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="email", type="string", format="email"),
     *         @OA\Property(property="password", type="string", minLength=8),
     *         @OA\Property(property="role", type="integer", enum={1,2,3})
     *     )),
     *     @OA\Response(response=200, description="User berhasil diupdate"),
     *     @OA\Response(response=404, description="User tidak ditemukan"))
     * @OA\Delete(path="/api/users/{id}", summary="Hapus user (Admin only)", tags={"Users"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="User berhasil dihapus"),
     *     @OA\Response(response=403, description="Tidak dapat menghapus Owner"))
     * @OA\Put(path="/api/profile", summary="Update profil sendiri", tags={"Users"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="password", type="string", minLength=8)
     *     )),
     *     @OA\Response(response=200, description="Profil berhasil diperbarui"))
     */
    public function users() {}

    /**
     * @OA\Get(path="/api/bahan", summary="Daftar bahan baku", tags={"Stock"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar bahan", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Bahan"))))
     * @OA\Get(path="/api/stok-history/{bahan_id}", summary="Riwayat stok per bahan", tags={"Stock"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="bahan_id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Riwayat stok"))
     * @OA\Post(path="/api/stok-movement", summary="Tambah/kurang stok", tags={"Stock"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         @OA\Property(property="bahan_id", type="integer", nullable=true),
     *         @OA\Property(property="nama", type="string", nullable=true),
     *         @OA\Property(property="jumlah", type="number"),
     *         @OA\Property(property="tipe", type="string", enum={"plus","minus"}),
     *         @OA\Property(property="satuan", type="string"),
     *         @OA\Property(property="kategori", type="string", enum={"restock","produksi","penyesuaian"}),
     *         @OA\Property(property="alasan", type="string", nullable=true),
     *         @OA\Property(property="stock_limit", type="integer", nullable=true),
     *         @OA\Property(property="harga", type="number", nullable=true))),
     *     @OA\Response(response=200, description="Berhasil disimpan"))
     * @OA\Post(path="/api/produksi-stock", summary="Produksi stok hasil olahan", tags={"Stock"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         @OA\Property(property="hasil_id", type="integer"),
     *         @OA\Property(property="jumlah_hasil", type="number"),
     *         @OA\Property(property="satuan", type="string"),
     *         @OA\Property(property="bahan", type="array", @OA\Items(type="object",
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="jumlah", type="number"),
     *             @OA\Property(property="satuan", type="string"))))),
     *     @OA\Response(response=200, description="Produksi berhasil"))
     * @OA\Get(path="/api/stock-list", summary="List stok dengan status", tags={"Stock"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="List stok"))
     * @OA\Get(path="/api/stock-history", summary="Riwayat semua pergerakan stok", tags={"Stock"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Riwayat stok"))
     */
    public function stock() {}

    /**
     * @OA\Get(path="/api/session/active", summary="Cek sesi aktif user", tags={"Session"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Data sesi aktif"))
     * @OA\Get(path="/api/session/all-active", summary="Semua sesi aktif (Admin only)", tags={"Session"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Semua sesi aktif"))
     * @OA\Post(path="/api/session/start", summary="Mulai sesi kasir", tags={"Session"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="opening_cash", type="integer"))),
     *     @OA\Response(response=200, description="Sesi berhasil dimulai"),
     *     @OA\Response(response=400, description="Masih ada sesi aktif"))
     * @OA\Post(path="/api/session/end", summary="Tutup sesi kasir", tags={"Session"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="closing_cash", type="integer"))),
     *     @OA\Response(response=200, description="Sesi berhasil ditutup"),
     *     @OA\Response(response=400, description="Tidak ada sesi aktif / masih ada pesanan pending"))
     * @OA\Get(path="/api/session/last-recap", summary="Rekap sesi terakhir", tags={"Session"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Rekap sesi terakhir"))
     */
    public function session() {}

    /**
     * @OA\Get(path="/api/pengeluaran", summary="Daftar pengeluaran", tags={"Pengeluaran"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="start_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="end_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="kategori", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="user_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Daftar pengeluaran", @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Pengeluaran"))))
     * @OA\Post(path="/api/pengeluaran", summary="Catat pengeluaran baru", tags={"Pengeluaran"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(required=true, @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(
     *         @OA\Property(property="nama_pengeluaran", type="string"),
     *         @OA\Property(property="jumlah", type="number"),
     *         @OA\Property(property="kategori", type="string", nullable=true),
     *         @OA\Property(property="deskripsi", type="string", nullable=true),
     *         @OA\Property(property="tanggal", type="string", format="date", nullable=true),
     *         @OA\Property(property="session_id", type="integer", nullable=true),
     *         @OA\Property(property="evidence", type="string", format="binary", nullable=true)))),
     *     @OA\Response(response=201, description="Pengeluaran berhasil dicatat"))
     * @OA\Get(path="/api/pengeluaran/harian", summary="Rekap pengeluaran harian", tags={"Pengeluaran"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="tanggal", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Response(response=200, description="Rekap harian"))
     */
    public function pengeluaran() {}

    /**
     * @OA\Get(path="/api/laporan/pemasukan", summary="Detail laporan pemasukan", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="user_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="start_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="end_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="metode", in="query", @OA\Schema(type="string", enum={"QRIS","Tunai"})),
     *     @OA\Response(response=200, description="Detail pemasukan"))
     * @OA\Get(path="/api/laporan/pengeluaran", summary="Detail laporan pengeluaran", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="user_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="start_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="end_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="kategori", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Detail pengeluaran"))
     * @OA\Get(path="/api/laporan/users", summary="Daftar user untuk filter laporan", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar user"))
     * @OA\Get(path="/api/laporan/menu-items", summary="Daftar menu untuk filter laporan", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar menu"))
     * @OA\Get(path="/api/laporan/shifts", summary="Daftar shift untuk filter laporan", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Daftar shift"))
     * @OA\Get(path="/api/laporan/download-evidence", summary="Download bukti pengeluaran (ZIP)", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="start_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="end_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="pengeluaran_ids", in="query", @OA\Schema(type="string", description="Comma-separated IDs")),
     *     @OA\Response(response=200, description="File ZIP"))
     * @OA\Get(path="/api/hpp-history", summary="Riwayat perhitungan HPP", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Riwayat HPP"))
     * @OA\Post(path="/api/calculate-hpp", summary="Hitung HPP baru", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="HPP berhasil dihitung"))
     * @OA\Put(path="/api/hpp-history/{id}", summary="Update HPP", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="HPP berhasil diupdate"))
     * @OA\Get(path="/api/laba-rugi", summary="Laporan laba rugi", tags={"Laporan"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Laporan laba rugi"))
     */
    public function laporan() {}

    /**
     * @OA\Get(path="/api/attendance/status", summary="Cek status absensi hari ini", tags={"Attendance"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Status absensi"))
     * @OA\Post(path="/api/attendance/check-in", summary="Absen masuk", tags={"Attendance"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="keterangan", type="string", nullable=true),
     *         @OA\Property(property="status", type="string", enum={"hadir","izin","sakit"}))),
     *     @OA\Response(response=201, description="Absen masuk berhasil"),
     *     @OA\Response(response=400, description="Sudah absen masuk"))
     * @OA\Post(path="/api/attendance/check-out", summary="Absen keluar", tags={"Attendance"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Absen keluar berhasil"),
     *     @OA\Response(response=400, description="Belum absen masuk / sesi aktif masih ada"))
     * @OA\Get(path="/api/attendance/history", summary="Riwayat absensi", tags={"Attendance"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="start_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="end_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Response(response=200, description="Riwayat absensi"))
     */
    public function attendance() {}

    /**
     * @OA\Get(path="/api/tax", summary="Ambil setting pajak", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Setting pajak"))
     * @OA\Post(path="/api/tax", summary="Update setting pajak", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="tax_percent", type="integer"),
     *         @OA\Property(property="is_enabled", type="boolean"))),
     *     @OA\Response(response=200, description="Pajak berhasil diupdate"))
     * @OA\Get(path="/api/receipt-settings", summary="Ambil setting struk", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Setting struk"))
     * @OA\Post(path="/api/receipt-settings", summary="Update setting struk", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="nama_toko", type="string"),
     *         @OA\Property(property="alamat", type="string"),
     *         @OA\Property(property="footer", type="string"))),
     *     @OA\Response(response=200, description="Setting struk berhasil diupdate"))
     * @OA\Get(path="/api/qris-settings", summary="Ambil setting QRIS", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Setting QRIS"))
     * @OA\Post(path="/api/qris-settings", summary="Tambah setting QRIS", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\RequestBody(@OA\JsonContent(
     *         @OA\Property(property="nama_bank", type="string"),
     *         @OA\Property(property="no_rekening", type="string"),
     *         @OA\Property(property="gambar_qris", type="string", format="binary"))),
     *     @OA\Response(response=201, description="QRIS berhasil ditambahkan"))
     * @OA\Put(path="/api/qris-settings/{id}", summary="Update setting QRIS", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="QRIS berhasil diupdate"))
     * @OA\Delete(path="/api/qris-settings/{id}", summary="Hapus setting QRIS", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="QRIS berhasil dihapus"))
     * @OA\Post(path="/api/landing-page", summary="Update setting landing page", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Response(response=200, description="Landing page berhasil diupdate"))
     * @OA\Get(path="/api/evidence/{type}/{filename}", summary="Lihat file bukti", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="type", in="path", required=true, @OA\Schema(type="string", enum={"pengeluaran","produksi"})),
     *     @OA\Parameter(name="filename", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="File bukti"))
     * @OA\Get(path="/api/evidence/{type}/{filename}/download", summary="Download file bukti", tags={"Settings"}, security={{"sanctum": {}}},
     *     @OA\Parameter(name="type", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Parameter(name="filename", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Download file"))
     */
    public function settings() {}
}
