<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Stores which hero a guardian is linked to (for login disambiguation).
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('linked_hero_code', 20)->nullable()->after('hero_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('linked_hero_code');
        });
    }
};
