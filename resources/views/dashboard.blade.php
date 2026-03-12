@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-md-12 mb-4">
        <h2>Selamat Datang, {{ ucfirst($role) }}!</h2>
        <p class="text-muted">Hari ini: {{ date('d M Y') }}</p>
    </div>

    <div class="col-md-4">
        <div class="card bg-primary text-white mb-3">
            <div class="card-body">
                <h6>Terjual Hari Ini</h6>
                <h3>{{ $totalTerjual }} Porsi</h3>
            </div>
        </div>
    </div>
    
    <div class="col-md-4">
        <div class="card bg-success text-white mb-3">
            <div class="card-body">
                <h6>Stok Porsi Dapur</h6>
                <h3>{{ $stokPorsi }} Porsi</h3>
            </div>
        </div>
    </div>

    <div class="col-md-12 mt-4">
        <h4>Akses Menu Cepat</h4>
        <div class="row g-3">
            @if($role == 'owner' || $role == 'kasir')
            <div class="col-md-4">
                <a href="{{ route('kasir.index') }}" class="btn btn-info w-100 py-3 text-white">
                    <b>Masuk Ke Kasir (Penjualan)</b>
                </a>
            </div>
            @endif

            @if($role == 'owner' || $role == 'dapur')
            <div class="col-md-4">
                <a href="{{ route('dapur.index') }}" class="btn btn-warning w-100 py-3">
                    <b>Masuk Ke Dapur (Produksi)</b>
                </a>
            </div>
            @endif
        </div>
    </div>

    @if($role == 'owner')
    <div class="col-md-12 mt-5">
        <div class="card border-danger">
            <div class="card-header bg-danger text-white">Pengaturan Master Data (Owner Only)</div>
            <div class="card-body">
                <div class="btn-group">
                    <a href="/dashboard/menu" class="btn btn-outline-dark">Kelola Menu</a>
                    <a href="/dashboard/bahan" class="btn btn-outline-dark">Kelola Bahan Baku</a>
                    <a href="/dashboard/resep-menu" class="btn btn-outline-dark">Edit Resep (BOM)</a>
                    <a href="/dashboard/kategori-menu" class="btn btn-outline-dark">Kategori</a>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
@endsection