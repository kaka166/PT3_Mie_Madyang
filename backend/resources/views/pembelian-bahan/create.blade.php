@extends('layouts.app')
@section('content')
<h2>Input Belanja Bahan</h2>
<form action="/dashboard/dapur/pembelian-bahan?role={{ $role }}" method="POST">
    @csrf
    Bahan: 
    <select name="bahan_id">
        @foreach($bahan as $b) <option value="{{ $b->id }}">{{ $b->nama_bahan }}</option> @endforeach
    </select><br><br>
    Jumlah Beli: <input type="number" name="qty"><br><br>
    Total Harga: <input type="number" name="harga_total"><br><br>
    <button type="submit">Catat Pembelian</button>
</form>
@endsection