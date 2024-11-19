<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::table('wallets_payment_methods', function (Blueprint $table) {
                $table->dropColumn('bank_details_id');
                $table->unsignedBigInteger('billing_data_id')->nullable();
            });
        } catch (\Exception $e) {
        }
    }

    public function down(): void
    {
        try {
            Schema::table('wallets_payment_methods', function (Blueprint $table) {
                $table->dropColumn('billing_data_id');
                $table->unsignedBigInteger('bank_details_id')->nullable();
            });
        } catch (\Exception $e) {
        }
    }
};
