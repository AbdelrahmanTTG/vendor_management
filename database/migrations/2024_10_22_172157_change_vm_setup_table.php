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
        Schema::table('vm_setup', function (Blueprint $table) 
        {       
            $table->text('pe_invoice_subject')->nullable();
            $table->text('pe_invoice_body')->nullable();
            
            $table->text('pe_message_subject')->nullable();
            $table->text('pe_message_body')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vm_setup', function (Blueprint $table) {
            $table->dropColumn(['pe_invoice_subject', 'pe_invoice_body', 'pe_message_subject', 'pe_message_body', 'created_at', 'updated_at']);

        });
    }
};
