<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'age',
        'hero_code',
        'linked_hero_code',
        'stages_completed',
        'gold_stars',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Generate a unique hero code (e.g. G4K2-M9P1) for linking guardians.
     */
    public static function generateHeroCode(): string
    {
        do {
            $code = strtoupper(
                substr(bin2hex(random_bytes(2)), 0, 2) . rand(0, 9) .
                substr(bin2hex(random_bytes(2)), 0, 2) . '-' .
                substr(bin2hex(random_bytes(2)), 0, 2) . rand(0, 9) .
                substr(bin2hex(random_bytes(2)), 0, 2)
            );
        } while (self::where('hero_code', $code)->exists());

        return $code;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'stages_completed' => 'array',
        ];
    }
}
