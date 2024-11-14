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
        Schema::create('vendorTest', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vendor_id');
            $table->boolean('test_type');
            $table->boolean('test_result');
            $table->string('test_upload');
            $table->integer('source_lang');
            $table->integer('target_lang');
            $table->integer('MainSubject');
            $table->integer('SubSubject');
            $table->integer('service');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendorTest');
    }
};
