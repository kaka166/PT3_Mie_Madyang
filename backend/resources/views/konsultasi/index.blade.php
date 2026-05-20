@extends('layouts.app')

@section('content')

<style>
    .konsultasi-container {
        width: 100%;
        margin-top: 10px;
    }

    .konsultasi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .konsultasi-title {
        font-size: 24px;
        font-weight: bold;
        color: #4b3b8f;
    }

    .table-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        text-align: left;
        padding: 12px 15px;
        background: #f8f9fa;
        color: #333;
        font-weight: 600;
        border-bottom: 2px solid #dee2e6;
    }

    td {
        padding: 12px 15px;
        border-bottom: 1px solid #eee;
    }

    tr:hover {
        background: #f5f5f5;
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
        background: #3a2e7a;
    }
</style>

<div class="konsultasi-container">
    <div class="konsultasi-header">
        <div class="konsultasi-title">
            Konsultasi
        </div>
        @if($role == 'owner')
        <a href="/dashboard/konsultasi/create?role=owner" class="btn-add">
            + Tambah Konsultasi
        </a>
        @endif
    </div>

    <div class="table-card">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Topik</th>
                    <th>Status</th>
                    @if($role == 'owner')
                    <th>Aksi</th>
                    @endif
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="{{ $role == 'owner' ? 4 : 3 }}" class="text-center">
                        Belum ada data konsultasi.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

@endsection
