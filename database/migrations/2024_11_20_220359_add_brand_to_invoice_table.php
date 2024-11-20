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
            Schema::table('vendor_invoices', function (Blueprint $table) {
                $table->Integer('brand_id');
            });
        } catch (\Exception $e) {
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Schema::table('vendor_invoices', function (Blueprint $table) {
                $table->dropColumn([
                    'brand_id',
                ]);
            });
        } catch (\Exception $e) {
        }
    }
};
