<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

<<<<<<< HEAD
        //$middleware->append(HandleCors::class);
        // $middleware->remove(HandleCors::class);
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);
=======
        //$middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->remove(\Illuminate\Http\Middleware\HandleCors::class);
>>>>>>> 855574c8c35012ed8ff5b26dadacf00174bbbaa3
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
