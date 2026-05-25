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
use Illuminate\Support\Facades\Storage;

class PenjualanController extends Controller
{
    // ===============================
    // 🔥 GET ORDERS (Kitchen)
    // ===============================
    public function index()
    {
        $data = Penjualan::with('detail')
            ->where(function ($q) {
                $q->where('status', '!=', 'done')
                  ->orWhere(function ($q2) {
                      $q2->where('status', 'done')
                         ->where('tanggal', '>=', now()->subHours(24));
                  });
            })
            ->latest()
            ->get()
            ->map(function ($p) {
                $dt = \Carbon\Carbon::parse($p->tanggal ?? now())->setTimezone('Asia/Jakarta');
                $seq = $p->daily_seq ?? $p->id;
                $noTrx = str_pad($seq, 3, '0', STR_PAD_LEFT);
                return [
                    'id'       => $noTrx,
                    'original_id' => $p->id,
                    'waktu'    => $p->tanggal,
                    'customer' => $p->customer_name ?? 'Guest',
                    'items'    => $p->detail->sum('qty'),
                    'harga'    => $p->total,
                    'kondisi'  => $p->order_type === 'Dine In'
                        ? 'Makan Disini'
                        : 'Bungkus',
                    'status'   => match ($p->status) {
                        'pending' => 'Antri',
                        'cooking' => 'Dimasak',
                        'done'    => 'Ready',
                        default   => 'Antri'
                    },

                    'details' => $p->detail->map(function ($d) {
                        return [
                            'nama' => $d->menu?->nama_menu ?? '-',
                            'qty' => $d->qty,
                            'note' => $d->note ?? ''
                        ];
                    }),
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
            'items.*.note' => 'nullable|string'
        ]);

        DB::beginTransaction();

        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        try {
            $session = \App\Models\PosSession::where('user_id', Auth::id())
                ->whereNull('ended_at')
                ->latest()
                ->first();

            if (!$session) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Tidak ada sesi aktif. Silakan mulai sesi terlebih dahulu.'
                ], 400);
            }
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'total' => 0,
                'user_id' => Auth::user()->id,
                'session_id' => $session->id,
                'customer_name' => $request->customer_name,
                'order_type' => $request->order_type,
                'status' => 'pending',
                'metode_pembayaran' => $request->metode_pembayaran
            ]);

            $penjualan->daily_seq = Penjualan::whereDate('tanggal', today())->count();
            $penjualan->save();

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

                if (!$stok) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Stok tidak ditemukan untuk ' . $menu->nama_menu
                    ], 400);
                }

                if ($stok->qty < $qty) {
                    DB::rollBack();
                    return response()->json([
                        'error' => 'Stok tidak cukup untuk ' . $menu->nama_menu
                    ], 400);
                }

                $stok->qty -= $qty;
                $stok->save();

                $subtotal = $menu->harga_jual * $qty;
                $grand_total += $subtotal;

                PenjualanDetail::create([
                    'penjualan_id' => $penjualan->id,
                    'menu_id' => $menu->id,
                    'qty' => $qty,
                    'harga' => $menu->harga_jual,
                    'subtotal' => $subtotal,
                    'note' => $item['note'] ?? null,
                ]);
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
                'success' => true,
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

        $penjualan = Penjualan::with(['detail.menu', 'user' => function ($q) {
            $q->withTrashed();
        }])->findOrFail($id);

        $penjualan->status = $request->status;
        $penjualan->save();

        if ($request->status === 'done') {
            $already = Pemasukan::where('penjualan_id', $penjualan->id)->exists();

            if (!$already) {
                $user = $penjualan->user;
                Pemasukan::create([
                    'penjualan_id' => $penjualan->id,
                    'nama' => 'Order #' . $penjualan->id,
                    'total' => $penjualan->total,
                    'kasir' => $user ? $user->name : 'Unknown',
                    'metode' => $penjualan->metode_pembayaran ?? 'Tidak diketahui',
                    'waktu' => $penjualan->tanggal
                ]);
            }
        }

        return response()->json([
            'message' => 'Status updated'
        ]);
    }

    public function getPemasukan(Request $request)
    {
        $user = Auth::user();

        $query = Pemasukan::with(['penjualan.detail.menu', 'penjualan.user' => function ($q) {
            $q->withTrashed();
        }]);

        // Jika session_id dikirim via query param, filter berdasarkan itu
        if ($request->has('session_id')) {
            $query->whereHas('penjualan', function ($q) use ($request) {
                $q->where('session_id', $request->session_id);
            });
        } elseif ($user && $user->role === 2) {
            // Role kasir (role 2): filter hanya transaksi sesi aktif hari ini
            $activeSession = \App\Models\PosSession::where('user_id', $user->id)
                ->whereNull('ended_at')
                ->latest()
                ->first();

            if ($activeSession) {
                $query->whereHas('penjualan', function ($q) use ($activeSession) {
                    $q->where('session_id', $activeSession->id);
                });
            } else {
                // Tidak ada sesi aktif → kembalikan array kosong
                return response()->json([]);
            }
        }
        // Role admin (role 1): tampilkan semua (kecuali session_id ditentukan)

        $data = $query->latest()->get()->map(function ($p) {
            $penjualan = $p->penjualan;

            $kasirName = $p->kasir;
            if ($kasirName === 'Unknown' || $kasirName === null) {
                $kasirName = $penjualan?->user?->name ?? 'Unknown';
            }

            $seq = $penjualan ? ($penjualan->daily_seq ?? $penjualan->id) : $p->penjualan_id;

            return [
                'no'      => str_pad($seq, 3, '0', STR_PAD_LEFT),
                'nama'    => $penjualan->customer_name ?? 'Guest',
                'waktu'   => $p->waktu,
                'kasir'   => $kasirName,
                'metode'  => $p->metode,
                'jumlah'  => $p->total,
                'kondisi' => $penjualan?->order_type === 'Dine In' ? 'Makan di Tempat' : 'Bungkus',
                'details' => $penjualan?->detail?->map(function ($d) {
                    return [
                        'nama'     => $d->menu?->nama_menu ?? '-',
                        'qty'      => $d->qty,
                        'note'     => $d->note ?? '',
                        'harga'    => $d->harga,
                        'subtotal' => $d->subtotal,
                    ];
                }) ?? [],
            ];
        });

        return response()->json($data);
    }
}