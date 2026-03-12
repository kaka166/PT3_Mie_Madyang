@extends('layouts.app')

@section('content')

<style>
    .kategori-container {
        width: 100%;
        margin-top: 10px;
    }

    .kategori-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .kategori-title {
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

    .table-kategori {
        width: 100%;
        border-collapse: collapse;
    }

    .table-kategori thead {
        background: #4b3b8f;
        color: white;
    }

    .table-kategori th {
        text-align: left;
        padding: 14px;
        font-size: 14px;
    }

    .table-kategori td {
        padding: 14px;
        border-bottom: 1px solid #eee;
    }

    .table-kategori tbody tr:hover {
        background: #f3f1ff;
    }
</style>


<div class="kategori-container">

    <div class="kategori-header">

        <div class="kategori-title">
            Kategori Menu
        </div>

        <a href="/admin/kategori-menu/create" class="btn-add">
            + Tambah Kategori
        </a>

    </div>


    <div class="table-card">

        <table class="table-kategori">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama</th>
                </tr>
            </thead>

            <tbody>

                @foreach($kategori as $item)

                <tr>

                    <td>
                        {{ $item->id }}
                    </td>

                    <td>
                        {{ $item->nama_kategori }}
                    </td>

                </tr>

                @endforeach

            </tbody>

        </table>

    </div>

</div>

@endsection