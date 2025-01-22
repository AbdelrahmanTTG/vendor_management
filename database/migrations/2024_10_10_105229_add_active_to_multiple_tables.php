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
        Schema::table('regions', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });
        Schema::table('vendortimezone', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });

        Schema::table('countries', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });

        Schema::table('fields', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });

        Schema::table('task_type', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });
        Schema::table('currency', function (Blueprint $table) {
            $table->boolean('Active')->default(false);
        });
        Schema::table('tools', function (Blueprint $table) {
            $table->boolean('Active')->default(false);

        });
        Schema::table('languages', function (Blueprint $table) {
            $table->boolean('Active')->default(false);

        });
        Schema::table('unit', function (Blueprint $table) {
            $table->boolean('Active')->default(false);

        });
        Schema::table('languages_dialect', function (Blueprint $table) {
            $table->boolean('Active')->default(false);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('regions', function (Blueprint $table) {
            $table->dropColumn('Active');
        });

        Schema::table('vendortimezone', function (Blueprint $table) {
            $table->dropColumn('Active');
        });

        Schema::table('countries', function (Blueprint $table) {
            $table->dropColumn('Active');
        });

        Schema::table('fields', function (Blueprint $table) {
            $table->dropColumn('Active');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('Active');
        });

        Schema::table('task_type', function (Blueprint $table) {
            $table->dropColumn('Active');
        });
         Schema::table('currency', function (Blueprint $table) {
            $table->dropColumn('Active');
        });
        Schema::table('tools', function (Blueprint $table) {
            $table->dropColumn('Active');

        });
        Schema::table('languages', function (Blueprint $table) {
            $table->dropColumn('Active');

        });
        Schema::table('unit', function (Blueprint $table) {
            $table->dropColumn('Active');
        });
        Schema::table('languages_dialect', function (Blueprint $table) {
            $table->dropColumn('Active');

        });

    }
};
