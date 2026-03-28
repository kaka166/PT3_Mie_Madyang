@extends('layouts.app')
@section('content')
<h2>Masak / Produksi Porsi</h2>
<form action="/dashboard/dapur/produksi?role={{ $role }}" method="POST">
    @csrf
    Menu yang Dimasak: 
    <select name="menu_id">
        @foreach($menu as $m) <option value="{{ $m->id }}">{{ $m->nama_menu }}</option> @endforeach
    </select><br><br>
    Jumlah Porsi: <input type="number" name="jumlah_porsi"><br><br>
    <button type="submit">Mulai Produksi</button>
</form>
@endsection