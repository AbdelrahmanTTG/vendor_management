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
        try {
            Schema::create('vendorTest', function (Blueprint $table) {
                $table->id();
                $table->integer('vendor_id');
                $table->boolean('test_type');
                $table->boolean('test_result');
                $table->string('test_upload');
                $table->integer('source_lang');
                $table->integer('target_lang');
                $table->integer('main_subject');
                $table->integer('sub_subject');
                $table->integer('service');
                $table->timestamps();
            });
        } catch (\Exception $e) {
            // Ignore exception
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Schema::dropIfExists('vendorTest');
        } catch (\Exception $e) {
            // Ignore exception
        }
    }
};
