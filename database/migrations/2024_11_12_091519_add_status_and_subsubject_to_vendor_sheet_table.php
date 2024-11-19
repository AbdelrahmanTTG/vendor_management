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
            Schema::table('vendor_sheet', function (Blueprint $table) {
                $table->string('Status')->nullable(); 
                $table->string('SubSubject')->nullable(); 
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
            Schema::table('vendor_sheet', function (Blueprint $table) {
                $table->dropColumn(['Status', 'SubSubject']);
            });
        } catch (\Exception $e) {
            // Ignore exception
        }
    }
};
