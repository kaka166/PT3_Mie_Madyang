@extends('layouts.app')

@section('content')

<h2>Kategori Menu</h2>

<a href="/admin/kategori-menu/create">Tambah Kategori</a>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Nama</th>
    </tr>

    @foreach($kategori as $item)

    <tr>
        <td>{{ $item->id }}</td>
        <td>{{ $item->nama_kategori }}</td>
    </tr>

    @endforeach

</table>

@endsection