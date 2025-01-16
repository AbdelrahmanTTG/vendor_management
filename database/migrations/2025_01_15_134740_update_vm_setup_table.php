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
        Schema::table('vm_setup', function (Blueprint $table) {
            $table->text('erp_link')->nullable();
            $table->text('erp_uploads_folder_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vm_setup', function (Blueprint $table) {
           
            $table->dropColumn('erp_link');
            $table->dropColumn('erp_uploads_folder_path');
        });
    }
};
