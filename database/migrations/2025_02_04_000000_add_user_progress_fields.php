<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds map progress fields: stages_completed (JSON), gold_stars (0-3).
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('stages_completed')->nullable()->after('hero_code'); // [bool,bool,bool,bool,bool]
            $table->unsignedTinyInteger('gold_stars')->default(0)->after('stages_completed'); // 0-3
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['stages_completed', 'gold_stars']);
        });
    }
};
