@extends('layouts.app')

@section('content')
    <h2>Halaman Kasir</h2>
    <p>Halo, kamu masuk sebagai: <b>{{ ucfirst($role) }}</b></p>
    
    <hr>
    <a href="/dashboard/kasir/penjualan/create?role={{ $role }}" style="background: blue; color: white; padding: 10px; text-decoration: none;">
        + INPUT PENJUALAN BARU
    </a>

    <h3 style="margin-top: 30px;">Riwayat Penjualan Terakhir</h3>
    <table border="1" cellpadding="10" cellspacing="0" width="100%">
        <thead>
            <tr style="background: #eee;">
                <th>ID Nota</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($penjualan ?? [] as $jual)
                <tr>
                    <td>#{{ $jual->id }}</td>
                    <td>{{ $jual->tanggal }}</td>
                    <td>Rp {{ number_format($jual->total) }}</td>
                    <td><a href="#">Detail</a></td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" align="center">Belum ada penjualan hari ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection