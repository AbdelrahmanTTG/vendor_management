<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vendor_sheet', function (Blueprint $table) {
            $table->unsignedBigInteger('sheet_brand')->nullable(); // or after any relevant column
        });

        
        DB::statement("
            UPDATE vendor_sheet
            JOIN vendor ON vendor_sheet.vendor = vendor.id
            SET vendor_sheet.sheet_brand = vendor.brand
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_sheet', function (Blueprint $table) {
            $table->dropColumn('brand');
        });
    }
};
