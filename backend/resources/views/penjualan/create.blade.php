@extends('layouts.app')
@section('content')
<h2>Kasir (Input Penjualan)</h2>
<form action="/dashboard/kasir/penjualan?role={{ $role }}" method="POST">
    @csrf
    Menu: 
    <select name="menu_id">
        @foreach($menu as $m) 
            <option value="{{ $m->id }}">{{ $m->nama_menu }} (Stok: {{ $m->stokPorsi->qty ?? 0 }})</option> 
        @endforeach
    </select><br><br>
    Jumlah: <input type="number" name="qty" value="1"><br><br>
    <button type="submit" style="background: green; color: white; padding: 10px;">PROSES BAYAR</button>
</form>
@endsection