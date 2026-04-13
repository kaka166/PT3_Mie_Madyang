<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\PenjualanDetail;
use App\Models\Menu;
use App\Models\StokPorsi;
use App\Models\TaxSetting;
use Illuminate\Support\Facades\DB;

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
            'items.*.qty' => 'required|integer|min:1',
            'customer_name' => 'nullable|string',
            'order_type' => 'required|string'
        ]);

        DB::beginTransaction();

        try {
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'total' => 0,
                'user_id' => 1,
                'customer_name' => $request->customer_name,
                'order_type' => $request->order_type,
                'status' => 'pending'
            ]);

            $grand_total = 0;

            foreach ($request->items as $item) {

                $menu = Menu::find($item['menu_id']);

                if (!$menu) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Menu tidak ditemukan'
                    ], 400);
                }

                $qty = $item['qty'];
                $subtotal = $menu->harga_jual * $qty;
                $grand_total += $subtotal;

                PenjualanDetail::create([
                    'penjualan_id' => $penjualan->id,
                    'menu_id' => $menu->id,
                    'qty' => $qty,
                    'harga' => $menu->harga_jual,
                    'subtotal' => $subtotal
                ]);

                // 🔥 Update stok (kalau ada)
                $stok = StokPorsi::where('menu_id', $menu->id)->first();
                if ($stok) {
                    $stok->qty -= $qty;
                    $stok->save();
                }
            }

            // ===============================
            // 🔥 TAX LOGIC
            // ===============================
            $setting = TaxSetting::first();

            $tax = 0;

            if ($setting && $setting->is_enabled) {
                $taxPercent = (int) $setting->tax_percent;
                $tax = $grand_total * ($taxPercent / 100);
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

            return response()->json([
                'error' => $e->getMessage()
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

        $penjualan = Penjualan::findOrFail($id);

        $penjualan->status = $request->status;
        $penjualan->save();

        return response()->json([
            'message' => 'Status updated'
        ]);
    }
}