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
            $table->string('contact_linked_in')->nullable(false); 
            $table->string('contact_ProZ')->nullable(false);      
            $table->string('contact_other1')->nullable();       
            $table->string('contact_other2')->nullable();    
            $table->string('contact_other3')->nullable();      
            $table->string('Anothernumber')->nullable();
            $table->string('contact')->nullable()->change();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor', function (Blueprint $table) {
            $table->dropColumn([
                'contact_linked_in',
                'contact_ProZ',
                'contact_other1',
                'contact_other2',
                'contact_other3',
                'Anothernumber'
            ]);
        });
    }
};
