<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('messaging_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('Active')->default(true);
            $table->timestamps();
        });
        Schema::create('University_Degree', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('Active')->default(true);
            $table->timestamps();
        });
        Schema::create('Major', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('Active')->default(true);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messaging_types');
        Schema::dropIfExists('University_Degree');
        Schema::dropIfExists('Major');
    }
};
