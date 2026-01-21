<?php
/**
 * Class PaymentObserver
 *
 * Model observer for handling model events
 * Automatically triggers actions on model lifecycle events
 */namespace App\Domain\Payment\Observers;
use App\Domain\Payment\Entities\Payment;

class PaymentObserver
{
    public function dosomething($model) {}
}
