<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::create('vendor_files', function (Blueprint $table) {
                $table->id();
                $table->integer('vendor_id');
                $table->string('file_path');
                $table->string('file_title');
                $table->text('file_content');
                $table->timestamps();
            });
        } catch (\Exception $e) {
            // Handle the error silently
        }
    }

    public function down(): void
    {
        try {
            Schema::dropIfExists('vendor_files');
        } catch (\Exception $e) {
            // Handle the error silently
        }
    }
};
