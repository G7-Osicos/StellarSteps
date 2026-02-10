<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChapterProgressController extends Controller
{
    /**
     * Mark the start time of a chapter for the current hero.
     */
    public function start(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'hero') {
            return response()->json(['ok' => false, 'message' => 'Hero login required'], 403);
        }

        $chapter = (int) $request->input('chapter');
        if (! in_array($chapter, [1, 2, 3], true)) {
            return response()->json(['ok' => false, 'message' => 'Invalid chapter'], 422);
        }

        $key = 'chapter'.$chapter;
        $times = $user->chapter_times ?? [];

        // Always track the latest run: when a chapter is (re)started, reset
        // started_at and clear finished_at.
        $times[$key] = [
            'started_at' => now()->toIso8601String(),
            'finished_at' => null,
        ];

        $user->chapter_times = $times;
        $user->save();

        return response()->json(['ok' => true]);
    }

    /**
     * Mark the finish time of a chapter for the current hero.
     */
    public function finish(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'hero') {
            return response()->json(['ok' => false, 'message' => 'Hero login required'], 403);
        }

        $chapter = (int) $request->input('chapter');
        if (! in_array($chapter, [1, 2, 3], true)) {
            return response()->json(['ok' => false, 'message' => 'Invalid chapter'], 422);
        }

        $key = 'chapter'.$chapter;
        $times = $user->chapter_times ?? [];

        $finishedAt = now()->toIso8601String();

        // If the chapter was never explicitly started, infer a start time so
        // guardians still see something sensible.
        $existing = $times[$key] ?? [];
        $startedAt = $existing['started_at'] ?? $finishedAt;

        $times[$key] = [
            'started_at' => $startedAt,
            'finished_at' => $finishedAt,
        ];

        $user->chapter_times = $times;
        $user->save();

        return response()->json(['ok' => true]);
    }
}

