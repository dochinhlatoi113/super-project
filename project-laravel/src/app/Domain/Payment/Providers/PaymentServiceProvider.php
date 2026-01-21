<?php
/**
 * Class PaymentServiceProvider
 *
 * Service provider for registering services and bindings
 * Handles dependency injection and service registration
 */namespace App\Domain\Payment\Providers;
use Illuminate\Support\ServiceProvider;
use App\Domain\Payment\Repositories\PaymentRepositoryInterface;
use App\Domain\Payment\Repositories\PaymentRepository;

class PaymentServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
    }

    public function boot()
    {
        \App\Domain\Payment\Entities\Payment::observe(\App\Domain\Payment\Observers\PaymentObserver::class);

        // Load routes
        $this->loadRoutesFrom(__DIR__.'/../routes/api.php');
    }
}
