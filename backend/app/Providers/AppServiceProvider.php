<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use OpenApi\Analysers\AttributeAnnotationFactory;
use OpenApi\Analysers\DocBlockAnnotationFactory;
use OpenApi\Analysers\ReflectionAnalyser;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        config()->set('l5-swagger.defaults.scanOptions.analyser', new ReflectionAnalyser([
            new AttributeAnnotationFactory(),
            new DocBlockAnnotationFactory(),
        ]));
    }

    public function boot(): void
    {
        //
    }
}
