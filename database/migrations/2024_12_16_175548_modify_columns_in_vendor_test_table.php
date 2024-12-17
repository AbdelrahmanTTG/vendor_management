<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('vendorTest', function (Blueprint $table) {
            $table->string('test_type', 1)->change();
            $table->string('test_result', 1)->change();
        });
    }

    public function down()
    {
        Schema::table('vendorTest', function (Blueprint $table) {
            $table->string('test_type')->change();
            $table->string('test_result')->change();
        });
    }
};
