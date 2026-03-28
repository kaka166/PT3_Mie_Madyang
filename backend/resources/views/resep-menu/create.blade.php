@extends('layouts.app')
@section('content')
<h2>Setting Resep (BOM)</h2>
<form action="/dashboard/resep-menu?role={{ $role }}" method="POST">
    @csrf
    Pilih Menu:
    <select name="menu_id">
        @foreach($menu as $m) <option value="{{ $m->id }}">{{ $m->nama_menu }}</option> @endforeach
    </select><br><br>
    Bahan:
    <select name="bahan_id">
        @foreach($bahan as $b) <option value="{{ $b->id }}">{{ $b->nama_bahan }} ({{ $b->satuan }})</option> @endforeach
    </select><br><br>
    Takaran: <input type="number" step="0.01" name="qty"><br><br>
    <button type="submit">Simpan Komposisi</button>
</form>
@endsection