<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        try {
            Schema::create('vendor_skill', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('vendor_id');
                $table->unsignedBigInteger('skill_id');
                $table->timestamps();
            });
        } catch (\Exception $e) {
            // Handle the error silently
        }
    }

    public function down(): void
    {
        try {
            Schema::dropIfExists('vendor_skill');
        } catch (\Exception $e) {
            // Handle the error silently
        }
    }
};
