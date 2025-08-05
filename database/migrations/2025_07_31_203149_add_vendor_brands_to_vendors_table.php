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
    public function up()
    {
       Schema::table('vendor', function (Blueprint $table) {
            $table->string('vendor_brands')->nullable()->after('brand');
        });

        DB::table('vendor')->update([
            'vendor_brands' => DB::raw('brand')
        ]);
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor', function (Blueprint $table) {
            $table->dropColumn('vendor_brands');
        });
    }
};
