<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Stores per-chapter start/finish timestamps for heroes.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('chapter_times')->nullable()->after('gold_stars');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('chapter_times');
        });
    }
};

