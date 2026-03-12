<!DOCTYPE html>
<html>

<head>
    <title>Kasir Mie - {{ ucfirst($role ?? 'Guest') }}</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
            line-height: 1.6;
        }

        nav a {
            text-decoration: none;
            color: blue;
            margin-right: 10px;
            font-weight: bold;
        }

        nav a:hover {
            text-decoration: underline;
        }

        .active {
            color: red;
        }
    </style>
</head>

<body>

    <h1>Kasir Mie - Mode {{ ucfirst($role ?? 'General') }}</h1>

    <nav>
        <a href="/dashboard?role={{ $role ?? 'owner' }}">🏠 Dashboard Utama</a> |

        <a href="/dashboard/menu?role={{ $role ?? 'owner' }}">📋 Menu</a> |

        @if(($role ?? '') == 'owner')
        <a href="/dashboard/kategori-menu?role=owner">Kategori</a> |
        <a href="/dashboard/bahan?role=owner">Bahan</a> |
        <a href="/dashboard/resep-menu?role=owner">Resep</a> |
        @endif

        @if(($role ?? '') == 'owner' || ($role ?? '') == 'dapur')
        <a href="/dashboard/dapur/pembelian-bahan?role={{ $role }}">Pembelian Bahan</a> |
        <a href="/dashboard/dapur/produksi?role={{ $role }}">Produksi</a> |
        @endif

        @if(($role ?? '') == 'owner' || ($role ?? '') == 'kasir')
        <a href="/dashboard/kasir/penjualan?role={{ $role }}">Kasir (Jual)</a> |
        <a href="/dashboard/kasir/pengeluaran?role={{ $role }}">Catat Pengeluaran</a> |
        @endif

        <a href="/" style="color: grey;">Log Out</a>
    </nav>

    <hr>

    <div class="container">
        @yield('content')
    </div>

</body>

</html>