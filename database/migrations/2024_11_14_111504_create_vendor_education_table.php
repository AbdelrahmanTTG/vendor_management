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
            Schema::create('vendor_education', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('vendor_id');
                $table->string('university_name');
                $table->string('latest_degree');
                $table->year('year_of_graduation');
                $table->string('major');
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
            Schema::dropIfExists('vendor_education');
        } catch (\Exception $e) {
            // Ignore exception
        }
    }
};
