<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        
        DB::table('users')->insert([
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'email' => 'admin@madyang.com',
            'password' => Hash::make('admin123'),
            'role' => 1, 
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        $owners = [
            ['name' => 'Haikal', 'username' => 'neko'],
            ['name' => 'Kevin',  'username' => 'jonson'],
            ['name' => 'Dika',   'username' => 'bangdik'],
            ['name' => 'Relz',   'username' => 'relzy'],
            ['name' => 'Hafiz',  'username' => 'hafizzz'],
        ];

        foreach ($owners as $owner) {
            DB::table('users')->insert([
                'name' => $owner['name'],
                'username' => $owner['username'],
                'email' => $owner['username'] . '@madyang.com',
                'password' => Hash::make('password123'),
                'role' => 1, 
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}