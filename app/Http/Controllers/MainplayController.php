<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MainplayController extends Controller
{
    /** Default stages: all uncleared */
    private const DEFAULT_STAGES = [false, false, false, false, false];

    /**
     * Load mainplay page with user-specific progress.
     * If URL has completion params, update user progress first.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $url = $request->fullUrl();

        $stages = self::DEFAULT_STAGES;
        $goldStars = 0;

        if ($user) {
            // For guardians, show the linked hero's progress so they can monitor it.
            $progressOwner = $user;
            if ($user->role === 'guardian' && $user->linked_hero_code) {
                $hero = User::where('role', 'hero')
                    ->where('hero_code', $user->linked_hero_code)
                    ->first();

                if ($hero) {
                    $progressOwner = $hero;
                }
            }

            // Load progress from the owner (hero for heroes; linked hero for guardians)
            $stages = $progressOwner->stages_completed ?? self::DEFAULT_STAGES;
            $goldStars = (int) ($progressOwner->gold_stars ?? 0);

            // Ensure stages is array of 5 booleans
            if (! is_array($stages) || count($stages) !== 5) {
                $stages = self::DEFAULT_STAGES;
            }

            // Apply completion from URL and persist only for heroes (guardians are read-only monitors)
            if ($progressOwner->role === 'hero') {
                $updated = false;

                if (str_contains($url, 'prologue_castle_hint=1')) {
                    $stages[0] = true;
                    $updated = true;
                }
                if (str_contains($url, 'chapter1_complete=1')) {
                    $stages[0] = true;
                    $stages[1] = true;
                    $goldStars = max($goldStars, 1);
                    $updated = true;
                }
                if (str_contains($url, 'chapter2_complete=1')) {
                    $stages[0] = true;
                    $stages[1] = true;
                    $stages[2] = true;
                    $goldStars = max($goldStars, 2);
                    $updated = true;
                }
                if (str_contains($url, 'chapter3_complete=1')) {
                    $stages[0] = true;
                    $stages[1] = true;
                    $stages[2] = true;
                    $stages[3] = true;
                    $goldStars = max($goldStars, 3);
                    $updated = true;
                }
                if (str_contains($url, 'all_complete=1')) {
                    $stages = [true, true, true, true, true];
                    $goldStars = 3;
                    $updated = true;
                }

                if ($updated) {
                    $progressOwner->stages_completed = $stages;
                    $progressOwner->gold_stars = $goldStars;
                    $progressOwner->save();
                }
            }
        } else {
            // Guest: derive from URL only (no persistence)
            if (str_contains($url, 'prologue_castle_hint=1')) {
                $stages[0] = true;
            }
            if (str_contains($url, 'chapter1_complete=1')) {
                $stages[0] = true;
                $stages[1] = true;
                $goldStars = 1;
            }
            if (str_contains($url, 'chapter2_complete=1')) {
                $stages[0] = true;
                $stages[1] = true;
                $stages[2] = true;
                $goldStars = 2;
            }
            if (str_contains($url, 'chapter3_complete=1')) {
                $stages[0] = true;
                $stages[1] = true;
                $stages[2] = true;
                $stages[3] = true;
                $goldStars = 3;
            }
            if (str_contains($url, 'all_complete=1')) {
                $stages = [true, true, true, true, true];
                $goldStars = 3;
            }
        }

        return Inertia::render('Mainplay', [
            'initialProgress' => [
                'clearedStages' => $stages,
                'goldStars' => $goldStars,
            ],
        ]);
    }

    /**
     * Save progress (for clients that call this instead of relying on URL params).
     */
    public function saveProgress(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['ok' => false, 'message' => 'Login required'], 401);
        }

        $stages = $request->input('clearedStages');
        $goldStars = (int) $request->input('goldStars', 0);

        if (! is_array($stages) || count($stages) !== 5) {
            return response()->json(['ok' => false, 'message' => 'Invalid stages'], 422);
        }

        $user->stages_completed = array_map('boolval', $stages);
        $user->gold_stars = max(0, min(3, $goldStars));
        $user->save();

        return response()->json(['ok' => true]);
    }
}
