@extends('layouts.app')
@section('content')
<h2>Tambah Bahan Baru</h2>
<form action="/dashboard/bahan?role={{ $role }}" method="POST">
    @csrf
    Nama: <input type="text" name="nama_bahan"> Satuan: <input type="text" name="satuan" placeholder="gram/pcs">
    <button type="submit">Simpan</button>
</form>
@endsection