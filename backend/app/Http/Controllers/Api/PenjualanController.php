<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\PenjualanDetail;
use App\Models\Menu;
use App\Models\StokPorsi;
use App\Models\TaxSetting;
use App\Models\Pemasukan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PenjualanController extends Controller
{
    // ===============================
    // 🔥 GET ORDERS (Kitchen)
    // ===============================
    public function index()
    {
        $data = Penjualan::with('detail')
            ->latest()
            ->get()
            ->map(function ($p) {
                return [
                    'id' => '#' . $p->id,
                    'waktu' => $p->tanggal,
                    'customer' => $p->customer_name ?? 'Guest',
                    'items' => $p->detail->sum('qty'),
                    'harga' => $p->total,
                    'kondisi' => $p->order_type === 'Dine In'
                        ? 'Makan Disini'
                        : 'Bungkus',
                    'status' => match ($p->status) {
                        'pending' => 'Antri',
                        'cooking' => 'Dimasak',
                        'done' => 'Ready',
                        default => 'Antri'
                    }
                ];
            });

        return response()->json($data);
    }

    // ===============================
    // 🔥 CREATE ORDER (Cashier)
    // ===============================
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menu,id',
            'items.*.qty' => 'required|integer|min:1|max:100',
            'customer_name' => 'nullable|string',
            'order_type' => 'required|in:Dine In,Take Away',
            'metode_pembayaran' => 'required|in:QRIS,Tunai',
        ]);

        DB::beginTransaction();

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        try {
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'total' => 0,
                'user_id' => Auth::user()->id,
                'customer_name' => $request->customer_name,
                'order_type' => $request->order_type,
                'status' => 'pending',
                'metode_pembayaran' => $request->metode_pembayaran
            ]);

            $grand_total = 0;

            foreach ($request->items as $item) {

                $menu = Menu::find($item['menu_id']);

                if (!$menu || !$menu->is_active) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Menu tidak valid'
                    ], 400);
                }

                $qty = $item['qty'];

                $stok = StokPorsi::where('menu_id', $menu->id)
                    ->lockForUpdate()
                    ->first();

                if ($stok && $stok->qty < $qty) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Stok tidak cukup untuk ' . $menu->nama_menu
                    ], 400);
                }

                $subtotal = $menu->harga_jual * $qty;
                $grand_total += $subtotal;

                PenjualanDetail::create([
                    'penjualan_id' => $penjualan->id,
                    'menu_id' => $menu->id,
                    'qty' => $qty,
                    'harga' => $menu->harga_jual,
                    'subtotal' => $subtotal
                ]);

                if (!$stok) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Stok tidak ditemukan untuk ' . $menu->nama_menu
                    ], 400);
                }
            }

            // ===============================
            // 🔥 TAX LOGIC
            // ===============================
            $setting = TaxSetting::first();

            $tax = 0;

            if ($setting && $setting->is_enabled) {
                $taxPercent = (int) $setting->tax_percent;
                $tax = round($grand_total * ($taxPercent / 100));
            }

            $totalFinal = $grand_total + $tax;

            $penjualan->total = $totalFinal;
            $penjualan->save();

            DB::commit();

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'data' => $penjualan->load('detail.menu')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error($e);

            return response()->json([
                'error' => 'Terjadi kesalahan pada server'
            ], 500);
        }
    }

    // ===============================
    // 🔥 UPDATE STATUS (Kitchen)
    // ===============================
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,cooking,done'
        ]);

        $penjualan = Penjualan::with('detail.menu', 'user')->findOrFail($id);

        $penjualan->status = $request->status;
        $penjualan->save();

        // 🔥 TAMBAH INI (KUNCI UTAMA)
        if ($request->status === 'done') {

            // 🔥 CEK biar gak double insert
            $already = Pemasukan::where('penjualan_id', $penjualan->id)->exists();

            if (!$already) {
                Pemasukan::create([
                    'penjualan_id' => $penjualan->id,
                    'nama' => 'Order #' . $penjualan->id,
                    'total' => $penjualan->total,
                    'kasir' => $penjualan->user->name ?? 'Unknown',
                    'metode' => $penjualan->metode_pembayaran ?? 'Tidak diketahui',
                    'waktu' => $penjualan->tanggal
                ]);
            }
        }

        return response()->json([
            'message' => 'Status updated'
        ]);
    }

    public function getPemasukan()
    {
        $data = Pemasukan::latest()->get()->map(function ($p) {
            return [
                'no' => '#' . $p->penjualan_id,
                'nama' => $p->nama,
                'waktu' => $p->waktu,
                'kasir' => $p->kasir,
                'metode' => $p->metode,
                'jumlah' => $p->total
            ];
        });

        return response()->json($data);
    }
}