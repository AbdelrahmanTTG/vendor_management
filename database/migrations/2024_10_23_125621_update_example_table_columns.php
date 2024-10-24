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
        Schema::table('vendor', function (Blueprint $table) {
            $table->text('name')->nullable(false)->change();
            $table->string('email')->nullable(false)->change();
            $table->string('password', 255)->nullable(false)->change();
            $table->integer('first_login')->nullable()->change();
            $table->string('account_status', 255)->nullable()->change();
            $table->text('contact')->nullable()->change();
            $table->text('phone_number')->nullable()->change();
            $table->text('mother_tongue')->nullable()->change();
            $table->text('country')->nullable()->change();
            $table->text('guilty')->nullable()->change();
            $table->text('communication')->nullable()->change();
            $table->text('commitment')->nullable()->change();
            $table->text('profile')->nullable()->change();
            $table->text('subject')->nullable()->change();
            $table->text('tools')->nullable()->change();
            $table->text('sheet_fields')->nullable()->change();
            $table->text('sheet_tools')->nullable()->change();
            $table->text('cv')->nullable()->change();
            $table->text('certificate')->nullable()->change();
            $table->text('NDA')->nullable()->change();
            $table->integer('brand')->nullable()->change();
            $table->integer('color')->nullable()->change();
            $table->text('color_comment')->nullable()->change();
            $table->string('type', 255)->nullable(false)->change();
            $table->string('status', 255)->nullable(false)->change();
            $table->tinyInteger('favourite')->nullable()->change();
            $table->integer('external_id')->nullable()->change();
            $table->integer('created_by')->nullable()->change();
            $table->timestamp('created_at')->nullable()->change();
            $table->integer('av_block_count')->nullable(false)->default(0)->change();
            $table->tinyInteger('av_block')->nullable(false)->default(0)->change();
            $table->string('nationality', 255)->nullable(false)->change();
            $table->string('timezone', 255)->nullable()->change();
            $table->text('reject_reason')->nullable()->change();
            $table->string('pmt_name', 255)->nullable()->change();
            $table->text('city')->nullable(false)->change();
            $table->text('street')->nullable(false)->change();
            $table->text('address')->nullable(false)->change();
            $table->string('contact_name', 255)->nullable(false)->change();
            $table->string('legal_name', 255)->nullable(false)->change();
            $table->integer('region')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor', function (Blueprint $table) {
            //
        });
    }
};
