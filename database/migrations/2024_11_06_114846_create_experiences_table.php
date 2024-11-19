<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        try {
            Schema::create('experiences', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('vendor_id');
                $table->string('started_working');
                $table->integer('experience_year');
                $table->text('summary')->nullable();
                $table->timestamps();
            });
        } catch (\Exception $e) {
        }
    }

    public function down(): void
    {
        try {
            Schema::dropIfExists('experiences');
        } catch (\Exception $e) {
        }
    }
};
