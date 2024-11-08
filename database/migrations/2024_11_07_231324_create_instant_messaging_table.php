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
        Schema::create('instant_messaging', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedInteger('vendor_id'); 
            $table->unsignedBigInteger('messaging_type_id'); 
            $table->string('contact'); 
            $table->timestamps(); 

            // $table->foreign('vendor_id')->references('id')->on('vendor')->onDelete('cascade');
            // $table->foreign('messaging_type_id')->references('id')->on('messaging_type')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instant_messaging');
    }
};
