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
        Schema::table('billing_data', function (Blueprint $table) {
            $table->char('billing_status', 1)->nullable();
        });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('billing_data', function (Blueprint $table) {
            $table->dropColumn('billing_status'); 
        });
    }
};
