<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vendor', function (Blueprint $table) {
            $table->integer('nationality')->nullable();
            $table->string('timezone')->nullable();
            $table->text('reject_reason')->nullable();
            $table->string('prfx_name')->nullable();
            $table->string('city')->nullable();
            $table->string('street')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('legal_Name')->nullable();
            $table->integer('region')->nullable();
            $table->text('note')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor', function (Blueprint $table) {
            $table->dropColumn(['nationality', 'timezone', 'reject_reason', 'prfx_name', 'city', 'street', 'address', 'note','contact_name',"legal_Name" ,'region']);

        });
    }
};
