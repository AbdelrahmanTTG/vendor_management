<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::table('vendor', function (Blueprint $table) {
                $table->string('password')->nullable()->change();
            });
        } catch (\Exception $e) {
            // Ignore exception
        }
    }

    public function down(): void
    {
        try {
            Schema::table('vendor', function (Blueprint $table) {
                $table->string('password')->nullable()->change();
            });
        } catch (\Exception $e) {
            // Ignore exception
        }
    }
};
