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
            Schema::table('billing_data', function (Blueprint $table) {
                if (!Schema::hasColumn('billing_data', 'billing_currency')) {
                    $table->string('billing_currency')->nullable(false);
                }
            });
        } catch (\Exception $e) {
            // Ignore exception
        }
    }

    public function down(): void
    {
        try {
            Schema::table('billing_data', function (Blueprint $table) {
                if (Schema::hasColumn('billing_data', 'billing_currency')) {
                    $table->dropColumn('billing_currency');
                }
            });
        } catch (\Exception $e) {
            // Ignore exception
        }
    }
};
