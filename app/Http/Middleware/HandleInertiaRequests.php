<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        // Share only safe, serializable user data (avoids 500 if DB columns differ)
        $authUser = null;
        if ($user) {
            $authUser = [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role ?? null,
                'age' => $user->age ?? null,
                'hero_code' => $user->hero_code ?? null,
            ];
            if ($user->role === 'guardian' && ! empty($user->linked_hero_code)) {
                $hero = User::where('role', 'hero')->where('hero_code', $user->linked_hero_code)->first();
                $authUser['linked_hero_name'] = $hero?->name ?? null;
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $authUser,
            ],
        ];
    }
}
