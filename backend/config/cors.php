<?php

return [


    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://pt3-kelompok.farelzy.my.id',
        'http://pt3-kelompok.farelzy.my.id',
        'https://pt-3-mie-madyang-gamma.vercel.app', 
        'http://localhost:3000',
    ],

    'allowed_origins_patterns' => [
        '#^https:\/\/.*\.vercel\.app$#'
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];