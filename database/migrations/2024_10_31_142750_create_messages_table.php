<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->string('sender_email'); 
                $table->string('receiver_email');
                $table->text('content'); 
                $table->boolean('is_read')->default(false);
                $table->timestamps();
            });
        } catch (\Exception $e) {
        }
    }

    public function down(): void
    {
        try {
            Schema::dropIfExists('messages');
        } catch (\Exception $e) {
        }
    }
};
