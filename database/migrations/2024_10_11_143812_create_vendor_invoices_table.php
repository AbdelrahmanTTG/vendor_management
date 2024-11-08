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
        Schema::create('vendor_invoices', function (Blueprint $table) {
            $table->integerIncrements('id');
            $table->Integer('vendor_id');
            // $table->foreign('vendor_id')->references('id')->on('vendor')->noActionOnDelete()->noActionOnUpdate();
            $table->string('invoice_date');
            $table->text('vpo_file');
            $table->tinyInteger('verified');
            $table->tinyInteger('payment_method')->nullable();
            $table->Double('total');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_invoices');
    }
};
