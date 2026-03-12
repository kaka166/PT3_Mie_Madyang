@extends('layouts.app')

@section('content')

<style>
    .kasir-container {
        width: 100%;
        margin-top: 10px;
    }

    .kasir-title {
        font-size: 24px;
        font-weight: bold;
        color: #4b3b8f;
        margin-bottom: 10px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
        margin-bottom: 10px;
    }

    .btn-add {
        background: #4b3b8f;
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 500;
    }

    .btn-add:hover {
        background: #3b2f73;
    }

    .table-card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
    }

    .table-kasir {
        width: 100%;
        border-collapse: collapse;
    }

    .table-kasir thead {
        background: #4b3b8f;
        color: white;
    }

    .table-kasir th {
        text-align: left;
        padding: 14px;
        font-size: 14px;
    }

    .table-kasir td {
        padding: 14px;
        border-bottom: 1px solid #eee;
    }

    .table-kasir tbody tr:hover {
        background: #f3f1ff;
    }

    .btn-detail {
        background: #3498db;
        color: white;
        padding: 6px 10px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 13px;
    }

    .btn-detail:hover {
        background: #2c80b4;
    }
</style>



<div class="kasir-container">

    <div class="kasir-title">
        Halaman Kasir
    </div>

    <p>Halo, kamu masuk sebagai: <b>{{ ucfirst($role) }}</b></p>

    <div class="section-header">

        <h3>Riwayat Penjualan Terakhir</h3>

        <a href="/dashboard/kasir/penjualan/create?role={{ $role }}" class="btn-add">
            + Input Penjualan Baru
        </a>

    </div>


    <div class="table-card">

        <table class="table-kasir">

            <thead>
                <tr>
                    <th>ID Nota</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Aksi</th>
                </tr>
            </thead>

            <tbody>

                @forelse($penjualan ?? [] as $jual)

                <tr>

                    <td>
                        #{{ $jual->id }}
                    </td>

                    <td>
                        {{ $jual->tanggal }}
                    </td>

                    <td>
                        Rp {{ number_format($jual->total) }}
                    </td>

                    <td>
                        <a href="#" class="btn-detail">
                            Detail
                        </a>
                    </td>

                </tr>

                @empty

                <tr>
                    <td colspan="4" style="text-align:center; padding:20px;">
                        Belum ada penjualan hari ini.
                    </td>
                </tr>

                @endforelse

            </tbody>

        </table>

    </div>

</div>

@endsection