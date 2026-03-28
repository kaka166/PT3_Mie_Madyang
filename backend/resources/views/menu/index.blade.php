@extends('layouts.app')

@section('content')

<style>
    .menu-container {
        width: 100%;
        margin-top: 10px;
    }

    .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .menu-title {
        font-size: 24px;
        font-weight: bold;
        color: #4b3b8f;
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

    .table-menu {
        width: 100%;
        border-collapse: collapse;
    }

    .table-menu thead {
        background: #4b3b8f;
        color: white;
    }

    .table-menu th {
        text-align: left;
        padding: 14px;
        font-size: 14px;
    }

    .table-menu td {
        padding: 14px;
        border-bottom: 1px solid #eee;
    }

    .table-menu tbody tr:hover {
        background: #f3f1ff;
    }

    .btn-edit {
        background: #3498db;
        color: white;
        padding: 6px 10px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 13px;
    }

    .btn-delete {
        background: #e74c3c;
        color: white;
        padding: 6px 10px;
        border-radius: 5px;
        text-decoration: none;
        font-size: 13px;
    }

    .btn-edit:hover {
        background: #2c80b4;
    }

    .btn-delete:hover {
        background: #c0392b;
    }
</style>



<div class="menu-container">


    <div class="menu-header">

        <div class="menu-title">
            Daftar Menu Mie
        </div>

        @if($role == 'owner')
        <a href="/dashboard/menu/create?role=owner" class="btn-add">
            + Tambah Menu Baru
        </a>
        @endif

    </div>



    <div class="table-card">

        <table class="table-menu">

            <thead>
                <tr>
                    <th>Kategori</th>
                    <th>Nama Menu</th>
                    <th>Harga</th>

                    @if($role == 'owner')
                    <th>Aksi</th>
                    @endif

                </tr>
            </thead>

            <tbody>

                @foreach($menu as $item)

                <tr>

                    <td>
                        {{ $item->kategori->nama_kategori ?? '-' }}
                    </td>

                    <td>
                        {{ $item->nama_menu }}
                    </td>

                    <td>
                        Rp {{ number_format($item->harga_jual) }}
                    </td>

                    @if($role == 'owner')

                    <td>

                        <a href="#" class="btn-edit">
                            Edit
                        </a>

                        <a href="#" class="btn-delete">
                            Hapus
                        </a>

                    </td>

                    @endif

                </tr>

                @endforeach

            </tbody>

        </table>

    </div>


</div>

@endsection