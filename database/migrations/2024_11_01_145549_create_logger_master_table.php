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
        Schema::create('logger_master', function (Blueprint $table) {
            $table->id();
            $table->double('screen');
            $table->string('table_name');
            $table->string('transaction_id_name');
            $table->double('transaction_id');
            $table->tinyInteger('type');
            $table->double('created_by');
            $table->timestamps();
        });
        Schema::table('logger', function (Blueprint $table) {
            $table->unsignedBigInteger('master_id')->nullable();        
            // $table->foreign('master_id')->references('id')->on('logger_master')->noActionOnDelete()->noActionOnUpdate();    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logger_master');
        Schema::table('logger', function (Blueprint $table) {
            $table->dropForeign(['master_id']);
            $table->dropColumn('master_id');

        });
    }

};
