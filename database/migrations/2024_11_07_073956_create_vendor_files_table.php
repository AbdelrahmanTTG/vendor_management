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
        Schema::create('vendor_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vendor_id'); 
            $table->string('file_path'); 
            $table->string('file_title'); 
            $table->text('file_content'); 
            $table->timestamps();

            // $table->foreign('vendor_id')->references('id')->on('vendor')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_files');
    }
};
