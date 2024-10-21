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
        Schema::create('wallets_payment_methods', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('bank_details_id');
            $table->string('method');    
            $table->string('account'); 
            $table->timestamps();
            $table->foreign('bank_details_id')->references('id')->on('bank_details')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets_payment_methods');
    }
};
