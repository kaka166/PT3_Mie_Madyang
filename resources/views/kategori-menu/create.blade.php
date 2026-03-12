@extends('layouts.app')

@section('content')

<h2>Tambah Kategori</h2>

<form action="{{ route('kategori-menu.store') }}" method="POST">
    @csrf

    <input type="text" name="nama_kategori">

    <br><br>

    <button type="submit">Simpan</button>

</form>

@endsection