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
        Schema::table('wallets_payment_methods', function (Blueprint $table) {
            $table->dropForeign(['bank_details_id']);
            $table->dropColumn('bank_details_id');
            $table->unsignedBigInteger('billing_data_id')->nullable();
            $table->foreign('billing_data_id')->references('id')->on('billing_data')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallets_payment_methods', function (Blueprint $table) {
            $table->dropForeign(['billing_data_id']);
            $table->dropColumn('billing_data_id'); 
            $table->unsignedBigInteger('bank_details_id')->nullable();
            $table->foreign('bank_details_id')->references('id')->on('bank_details')->onDelete('cascade');
        });
    }
};
