<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            if (Schema::hasTable('vm_setup')) {
                Schema::table('vm_setup', function (Blueprint $table) {   
                    if (!Schema::hasColumn('vm_setup', 'pe_invoice_subject')) {
                        $table->text('pe_invoice_subject')->nullable();
                    }
                    if (!Schema::hasColumn('vm_setup', 'pe_invoice_body')) {
                        $table->text('pe_invoice_body')->nullable();
                    }
                    if (!Schema::hasColumn('vm_setup', 'pe_message_subject')) {
                        $table->text('pe_message_subject')->nullable();
                    }
                    if (!Schema::hasColumn('vm_setup', 'pe_message_body')) {
                        $table->text('pe_message_body')->nullable();
                    }
                    if (!Schema::hasColumn('vm_setup', 'created_at')) {
                        $table->timestamps();
                    }
                });
            }
        } catch (\Exception $e) {
        }
    }

    public function down(): void
    {
        try {
            if (Schema::hasTable('vm_setup')) {
                Schema::table('vm_setup', function (Blueprint $table) {
                    if (Schema::hasColumn('vm_setup', 'pe_invoice_subject')) {
                        $table->dropColumn('pe_invoice_subject');
                    }
                    if (Schema::hasColumn('vm_setup', 'pe_invoice_body')) {
                        $table->dropColumn('pe_invoice_body');
                    }
                    if (Schema::hasColumn('vm_setup', 'pe_message_subject')) {
                        $table->dropColumn('pe_message_subject');
                    }
                    if (Schema::hasColumn('vm_setup', 'pe_message_body')) {
                        $table->dropColumn('pe_message_body');
                    }
                    if (Schema::hasColumn('vm_setup', 'created_at') && Schema::hasColumn('vm_setup', 'updated_at')) {
                        $table->dropColumn(['created_at', 'updated_at']);
                    }
                });
            }
        } catch (\Exception $e) {
        }
    }
};
