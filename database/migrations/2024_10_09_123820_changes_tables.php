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
        if (!Schema::hasTable('job_task')) {
            Schema::create('job_task', function (Blueprint $table) {
                $table->id();
                $table->string('task_name');
                $table->timestamps();
            });
        }

        Schema::table('job_task', function ($table) {
            $table->unsignedInteger('invoice_id')->nullable();
            // $table->foreign('invoice_id')->references('id')->on('vendor_invoices')->noActionOnDelete()->noActionOnUpdate();
        });

        if (!Schema::hasTable('job_task_conversation')) {
            Schema::create('job_task_conversation', function (Blueprint $table) {
                $table->id();
                $table->text('file')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('job_task_conversation', function ($table) {
                $table->text('file')->nullable()->change();
            });
        }

        if (!Schema::hasTable('job_task_log')) {
            Schema::create('job_task_log', function (Blueprint $table) {
                $table->id();
                $table->text('comment')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('job_task_log', function ($table) {
                $table->text('comment')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_task', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
            $table->dropColumn('invoice_id');
        });

        if (Schema::hasTable('job_task_conversation')) {
            Schema::dropIfExists('job_task_conversation');
        }

        if (Schema::hasTable('job_task_log')) {
            Schema::dropIfExists('job_task_log');
        }
    }
};


