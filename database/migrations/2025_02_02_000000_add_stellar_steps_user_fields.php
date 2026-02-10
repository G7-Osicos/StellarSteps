<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds Hero/Guardian fields: role, age, hero_code; makes email nullable for PIN-based users.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 20)->default('hero')->after('name'); // 'hero' | 'guardian'
            $table->string('age', 20)->nullable()->after('role');
            $table->string('hero_code', 20)->nullable()->unique()->after('age'); // e.g. G4K2-M9P1 for linking guardian
        });

        // Make email nullable (avoids requiring doctrine/dbal for ->change())
        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY email VARCHAR(255) NULL');
        } elseif ($driver === 'sqlite') {
            DB::statement('-- SQLite: email nullable handled by schema above if needed');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'age', 'hero_code']);
        });

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'mysql') {
            DB::statement('ALTER TABLE users MODIFY email VARCHAR(255) NOT NULL');
        }
    }
};
