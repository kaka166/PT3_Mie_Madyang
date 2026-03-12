@extends('layouts.app')

@section('content')
<div style="display: flex; justify-content: space-between; align-items: center;">
    <h2>Daftar Menu Mie</h2>
    
    @if($role == 'owner')
        <a href="/dashboard/menu/create?role=owner" style="background: green; color: white; padding: 10px; text-decoration: none; border-radius: 5px;">
            + Tambah Menu Baru
        </a>
    @endif
</div>

<table border="1" cellpadding="10" width="100%" style="margin-top: 20px;">
    <thead>
        <tr style="background: #eee;">
            <th>Kategori</th>
            <th>Nama Menu</th>
            <th>Harga</th>
            @if($role == 'owner') <th>Aksi</th> @endif
        </tr>
    </thead>
    <tbody>
        @foreach($menu as $item)
        <tr>
            <td>{{ $item->kategori->nama_kategori ?? '-' }}</td>
            <td>{{ $item->nama_menu }}</td>
            <td>Rp {{ number_format($item->harga_jual) }}</td>
            
            @if($role == 'owner')
            <td>
                <a href="#">Edit</a> | 
                <a href="#" style="color: red;">Hapus</a>
            </td>
            @endif
        </tr>
        @endforeach
    </tbody>
</table>
@endsection