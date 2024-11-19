<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::create('skills', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->timestamps();
            });
        } catch (\Exception $e) {
        }
    }

    public function down(): void
    {
        try {
            Schema::dropIfExists('skills');
        } catch (\Exception $e) {
        }
    }
};
