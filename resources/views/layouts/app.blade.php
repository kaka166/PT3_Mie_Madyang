<!DOCTYPE html>
<html>

<head>
    <title>Kasir Mie - {{ ucfirst($role ?? 'Guest') }}</title>

    <style>
        body {
            font-family: "Segoe UI", Arial, sans-serif;
            margin: 0;
            background: #f4f4f8;
        }

        h1 {
            display: none;
        }

        nav {
            background: #4b3b8f;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            border-radius: 10px;
            margin: 20px;
        }

        .nav-title {
            color: white;
            font-size: 22px;
            font-weight: bold;
            margin-right: 30px;
        }

        nav a {
            color: #ddd;
            text-decoration: none;
            margin-right: 14px;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 14px;
        }

        nav a:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
        }

        .logout {
            margin-left: auto;
            background: rgba(255, 255, 255, 0.15);
        }

        .logout:hover {
            background: #e74c3c;
        }

        .search-box input {
            padding: 6px 10px;
            border-radius: 6px;
            border: none;
        }

        .container {
            margin: 20px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        .card-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .btn {
            background: #6c5ce7;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn:hover {
            background: #5848c2;
        }
    </style>
</head>

<body>

    <nav>

        <div class="nav-title">Dashboard</div>

        <a href="/dashboard?role={{ $role ?? 'owner' }}">Home</a>

        <a href="/dashboard/menu?role={{ $role ?? 'owner' }}">Menu</a>

        @if(($role ?? '') == 'owner')
        <a href="/dashboard/kategori-menu?role=owner">Kategori</a>
        <a href="/dashboard/bahan?role=owner">Bahan</a>
        <a href="/dashboard/resep-menu?role=owner">Resep</a>
        @endif

        @if(($role ?? '') == 'owner' || ($role ?? '') == 'dapur')
        <a href="/dashboard/dapur/pembelian-bahan?role={{ $role }}">Pembelian</a>
        <a href="/dashboard/dapur/produksi?role={{ $role }}">Produksi</a>
        @endif

        @if(($role ?? '') == 'owner' || ($role ?? '') == 'kasir')
        <a href="/dashboard/kasir/penjualan?role={{ $role }}">Penjualan</a>
        <a href="/dashboard/kasir/pengeluaran?role={{ $role }}">Pengeluaran</a>
        @endif

        <a href="/" class="logout">Log Out</a>

    </nav>

    <div class="container">
        @yield('content')
    </div>

</body>

</html>