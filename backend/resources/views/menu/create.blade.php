@extends('layouts.app')

@section('content')
<div style="max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
    <h2>Tambah Menu Baru (Mode Owner)</h2>
    <hr>

    <form action="/dashboard/menu?role={{ $role }}" method="POST">
        @csrf

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">Pilih Kategori Menu:</label>
            <select name="kategori_id" style="width: 100%; padding: 8px;" required>
                <option value="">-- Pilih Kategori --</option>
                @foreach($kategori as $item)
                    <option value="{{ $item->id }}">{{ $item->nama_kategori }}</option>
                @endforeach
            </select>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">Nama Menu:</label>
            <input type="text" name="nama_menu" placeholder="Contoh: Mie Ayam Bakso" style="width: 96%; padding: 8px;" required>
        </div>

        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px;">Harga Jual (Rp):</label>
            <input type="number" name="harga_jual" placeholder="Contoh: 15000" style="width: 96%; padding: 8px;" required>
        </div>

        <hr>
        <div style="display: flex; gap: 10px;">
            <button type="submit" style="background: green; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                Simpan Menu
            </button>
            <a href="/dashboard/menu?role={{ $role }}" style="background: grey; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                Batal
            </a>
        </div>
    </form>
</div>
@endsection