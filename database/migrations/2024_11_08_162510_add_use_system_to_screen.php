<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUseSystemToScreen extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        try {
            Schema::table('screen', function (Blueprint $table) {
                $table->string('use_system', 10)->nullable()->after('menu');
            });
        } catch (\Exception $e) {
            // Handle the error silently or log it
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        try {
            Schema::table('screen', function (Blueprint $table) {
                $table->dropColumn('use_system');
            });
        } catch (\Exception $e) {
            // Handle the error silently or log it
        }
    }
}
