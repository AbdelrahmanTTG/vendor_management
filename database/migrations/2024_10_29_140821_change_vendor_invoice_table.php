<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vendor_invoices', function (Blueprint $table) {
            $table->string('billing_legal_name')->nullable();
            $table->string('billing_currency')->nullable();
            $table->string('billing_due_date')->nullable();
            $table->text('billing_address')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_account_holder')->nullable();
            $table->string('bank_swift')->nullable();
            $table->string('bank_IBAN')->nullable();
            $table->string('bank_address')->nullable();
            $table->string('wallet_method')->nullable();
            $table->string('wallet_account')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_invoices', function (Blueprint $table) {
            $table->dropColumn([
                'billing_legal_name',
                'billing_legal_name',
                'billing_address',
                'billing_currency',
                'billing_due_date',
                'bank_name',
                'bank_account_holder',
                'bank_swift',
                'bank_IBAN',
                'bank_address',
                'wallet_method',
                'wallet_account'
            ]);
        });
    }
};
