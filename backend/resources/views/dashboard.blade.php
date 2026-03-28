@extends('layouts.app')

@section('content')

<style>
    body {
        background: linear-gradient(135deg, #f4f4f8, #ece9ff);
    }

    .dashboard-header {
        margin-bottom: 25px;
    }

    .dashboard-header h2 {
        margin-bottom: 5px;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .dashboard-card {

        background:
            radial-gradient(circle at 80% 20%, rgba(108, 92, 231, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(108, 92, 231, 0.15) 0%, transparent 60%),
            linear-gradient(135deg, #ffffff, #f3f0ff);

        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        transition: 0.2s;
    }

    .dashboard-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    }

    .card-title {
        font-size: 14px;
        color: #666;
    }

    .card-value {
        font-size: 28px;
        font-weight: bold;
        margin-top: 10px;
        color: #4b3b8f;
    }

    .dashboard-panels {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
    }

    .panel {

        background:
            radial-gradient(circle at 80% 20%, rgba(108, 92, 231, 0.08) 0%, transparent 60%),
            linear-gradient(135deg, #ffffff, #f7f6ff);

        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
        min-height: 250px;
    }

    .panel-title {
        font-weight: bold;
        margin-bottom: 15px;
        color: #4b3b8f;
    }

    .quick-menu {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
    }

    .quick-menu a {
        padding: 10px 16px;
        border-radius: 6px;
        font-weight: 500;
    }

    @media(max-width:900px) {

        .dashboard-panels {
            grid-template-columns: 1fr;
        }

    }
</style>


<div class="dashboard-header">

    <h2>Selamat Datang, {{ ucfirst($role) }}!</h2>
    <p style="color:#777;">Hari ini: {{ date('d M Y') }}</p>

</div>

<div class="dashboard-grid">

    <div class="dashboard-card">

        <div class="card-title">
            Terjual Hari Ini
        </div>

        <div class="card-value">
            {{ $totalTerjual }} Porsi
        </div>

    </div>


    <div class="dashboard-card">

        <div class="card-title">
            Stok Porsi Dapur
        </div>

        <div class="card-value">
            {{ $stokPorsi }} Porsi
        </div>

    </div>


    <div class="dashboard-card">

        <div class="card-title">
            Menu Tersedia
        </div>

        <div class="card-value">
            {{ $totalMenu ?? 0 }}
        </div>

    </div>

</div>


<div class="dashboard-panels">

    <div class="panel">

        <div class="panel-title">
            Akses Menu Cepat
        </div>

        <div class="quick-menu">

            @if($role == 'owner' || $role == 'kasir')

            <a href="{{ route('kasir.index') }}"
                class="btn btn-info text-white">
                Masuk Kasir
            </a>

            @endif


            @if($role == 'owner' || $role == 'dapur')

            <a href="{{ route('dapur.index') }}"
                class="btn btn-warning">
                Masuk Dapur
            </a>

            @endif

        </div>


        @if($role == 'owner')

        <hr style="margin:20px 0">


        <div class="panel-title">
            Pengaturan Master Data
        </div>

        <div class="quick-menu">

            <a href="/dashboard/menu"
                class="btn btn-outline-dark">
                Menu
            </a>

            <a href="/dashboard/bahan"
                class="btn btn-outline-dark">
                Bahan
            </a>

            <a href="/dashboard/resep-menu"
                class="btn btn-outline-dark">
                Resep
            </a>

            <a href="/dashboard/kategori-menu"
                class="btn btn-outline-dark">
                Kategori
            </a>

        </div>

        @endif

    </div>

    <div class="panel">

        <div class="panel-title">
            Informasi Sistem
        </div>

        <p>Total penjualan hari ini:</p>
        <b>{{ $totalTerjual }} porsi</b>

        <br><br>

        <p>Status dapur:</p>

        <b>
            {{ $stokPorsi > 0 ? 'Siap Produksi' : 'Stok Habis' }}
        </b>

    </div>


</div>

@endsection