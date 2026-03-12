@extends('layouts.app')
@section('content')
<h2>Stok Bahan Baku</h2>
<a href="/dashboard/bahan/create?role={{ $role }}">Tambah Bahan</a>
<table border="1" cellpadding="5">
    <tr>
        <th>ID</th>
        <th>Nama Bahan</th>
        <th>Satuan</th>
        <th>Stok</th>
    </tr>
    @foreach($bahan as $item)
    <tr>
        <td>{{ $item->id }}</td>
        <td>{{ $item->nama_bahan }}</td>
        <td>{{ $item->satuan }}</td>
        <td>{{ $item->stok->qty ?? 0 }}</td>
    </tr>
    @endforeach
</table>
@endsection