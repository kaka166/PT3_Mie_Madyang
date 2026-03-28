@extends('layouts.app')

@section('content')

<style>
    .bahan-container {
        width: 100%;
        margin-top: 10px;
    }

    .bahan-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .bahan-title {
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

    .table-bahan {
        width: 100%;
        border-collapse: collapse;
    }

    .table-bahan thead {
        background: #4b3b8f;
        color: white;
    }

    .table-bahan th {
        text-align: left;
        padding: 14px;
        font-size: 14px;
    }

    .table-bahan td {
        padding: 14px;
        border-bottom: 1px solid #eee;
    }

    .table-bahan tbody tr:hover {
        background: #f3f1ff;
    }
</style>


<div class="bahan-container">

    <div class="bahan-header">

        <div class="bahan-title">
            Stok Bahan Baku
        </div>

        <a href="/dashboard/bahan/create?role={{ $role }}" class="btn-add">
            + Tambah Bahan
        </a>

    </div>


    <div class="table-card">

        <table class="table-bahan">

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Bahan</th>
                    <th>Satuan</th>
                    <th>Stok</th>
                </tr>
            </thead>

            <tbody>

                @foreach($bahan as $item)

                <tr>

                    <td>
                        {{ $item->id }}
                    </td>

                    <td>
                        {{ $item->nama_bahan }}
                    </td>

                    <td>
                        {{ $item->satuan }}
                    </td>

                    <td>
                        {{ $item->stok->qty ?? 0 }}
                    </td>

                </tr>

                @endforeach

            </tbody>

        </table>

    </div>

</div>

@endsection