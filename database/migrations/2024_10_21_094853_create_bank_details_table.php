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
        Schema::create('bank_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('billing_data_id');  
            $table->string('bank_name');
            $table->string('account_holder');
            $table->string('swift_bic'); 
            $table->string('iban'); 
            $table->string('payment_terms');  
            $table->text('bank_address');
            $table->timestamps(); 
            $table->foreign('billing_data_id')->references('id')->on('billing_data')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_details');
    }
};
