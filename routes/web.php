<?php

use App\Http\Controllers\ChapterProgressController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StellarAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/signup', function () {
    return Inertia::render('Signup');
})->name('signup');

Route::post('/signup/hero', [StellarAuthController::class, 'registerHero'])->name('signup.hero');
Route::post('/signup/guardian', [StellarAuthController::class, 'registerGuardian'])->name('signup.guardian');
Route::post('/login/stellar', [StellarAuthController::class, 'login'])->name('login.stellar');

Route::get('/mainplay', [App\Http\Controllers\MainplayController::class, 'index'])->name('mainplay');
Route::post('/mainplay/progress', [App\Http\Controllers\MainplayController::class, 'saveProgress'])->name('mainplay.save-progress')->middleware('auth');

// Track per-chapter start and finish times for heroes.
Route::middleware('auth')->group(function () {
    Route::post('/api/chapter-progress/start', [ChapterProgressController::class, 'start'])->name('chapter-progress.start');
    Route::post('/api/chapter-progress/finish', [ChapterProgressController::class, 'finish'])->name('chapter-progress.finish');
});

Route::get('/mainplay/prologue-intro', function () {
    return Inertia::render('mainplay/PrologueIntro');
})->name('mainplay.prologue-intro');

Route::get('/mainplay/prologue1-attic', function () {
    return Inertia::render('mainplay/Stage1Attic');
})->name('mainplay.prologue1-attic');

Route::get('/mainplay/prologue1-attic/prologue2-attic', function () {
    return Inertia::render('mainplay/Stage2Attic');
})->name('mainplay.prologue1-attic.prologue2-attic');

Route::get('/mainplay/prologue-end', function () {
    return Inertia::render('mainplay/PrologueEnd');
})->name('mainplay.prologue-end');

Route::get('/mainplay/chapter1-intro', function () {
    return Inertia::render('mainplay/Chapter1Intro');
})->name('mainplay.chapter1-intro');

Route::get('/mainplay/chapter2-intro', function () {
    return Inertia::render('mainplay/Chapter2Intro');
})->name('mainplay.chapter2-intro');

Route::get('/mainplay/chapter3-intro', function () {
    return Inertia::render('mainplay/Chapter3Intro');
})->name('mainplay.chapter3-intro');

Route::get('/mainplay/epilogue-intro', function () {
    return Inertia::render('mainplay/EpilogueIntro');
})->name('mainplay.epilogue-intro');

Route::get('/mainplay/epilogue1-attic', function () {
    return Inertia::render('mainplay/Epilogue1Attic');
})->name('mainplay.epilogue1-attic');

Route::get('/mainplay/stellarsteps-complete', function () {
    return Inertia::render('mainplay/StellarstepsComplete');
})->name('mainplay.stellarsteps-complete');

Route::get('/mainplay/clouds1', function () {
    return Inertia::render('mainplay/Clouds1');
})->name('mainplay.clouds1');

Route::get('/mainplay/cloud2-game', function () {
    return Inertia::render('mainplay/Cloud2Game');
})->name('mainplay.cloud2-game');

Route::get('/mainplay/cloud2-game-instruction', function () {
    return Inertia::render('mainplay/Cloud2GameInstruction');
})->name('mainplay.cloud2-game-instruction');

Route::get('/mainplay/cloud3', function () {
    return Inertia::render('mainplay/Cloud3');
})->name('mainplay.cloud3');

Route::get('/mainplay/cloud4', function () {
    return Inertia::render('mainplay/Cloud4');
})->name('mainplay.cloud4');

Route::get('/mainplay/cloud5', function () {
    return Inertia::render('mainplay/Cloud5');
})->name('mainplay.cloud5');

Route::get('/mainplay/cloud6', function () {
    return Inertia::render('mainplay/Cloud6');
})->name('mainplay.cloud6');

Route::get('/mainplay/cloud6-end', function () {
    return Inertia::render('mainplay/Cloud6End');
})->name('mainplay.cloud6-end');

Route::get('/mainplay/gateofgratitude-complete', function () {
    return Inertia::render('mainplay/GateofgratitudeComplete');
})->name('mainplay.gateofgratitude-complete');

Route::get('/mainplay/chapter1', function () {
    return Inertia::render('mainplay/Chapter1');
})->name('mainplay.chapter1');

Route::get('/mainplay/kingdom1', function () {
    return Inertia::render('mainplay/Kingdom1');
})->name('mainplay.kingdom1');

Route::get('/mainplay/kingdom2', function () {
    return Inertia::render('mainplay/Kingdom2');
})->name('mainplay.kingdom2');

Route::get('/mainplay/kingdom3', function () {
    return Inertia::render('mainplay/Kingdom3');
})->name('mainplay.kingdom3');

Route::get('/mainplay/whisper1', function () {
    return Inertia::render('mainplay/Whisper1');
})->name('mainplay.whisper1');

Route::get('/mainplay/whisper2', function () {
    return Inertia::render('mainplay/Whisper2');
})->name('mainplay.whisper2');

Route::get('/mainplay/whisper3', function () {
    return Inertia::render('mainplay/Whisper3');
})->name('mainplay.whisper3');

Route::get('/mainplay/whisper4', function () {
    return Inertia::render('mainplay/Whisper4');
})->name('mainplay.whisper4');

Route::get('/mainplay/whisper4-game', function () {
    return Inertia::render('mainplay/Whisper4Game');
})->name('mainplay.whisper4-game');

Route::get('/mainplay/whisper4-end', function () {
    return Inertia::render('mainplay/Whisper4End');
})->name('mainplay.whisper4-end');

Route::get('/mainplay/whisper4-endstar', function () {
    return Inertia::render('mainplay/Whisper4EndStar');
})->name('mainplay.whisper4-endstar');

Route::get('/mainplay/whisperingwoods-complete', function () {
    return Inertia::render('mainplay/WhisperingwoodsComplete');
})->name('mainplay.whisperingwoods-complete');

Route::get('/mainplay/kingdom-end', function () {
    return Inertia::render('mainplay/KingdomEnd');
})->name('mainplay.kingdom-end');

Route::get('/mainplay/kingdom-complete', function () {
    return Inertia::render('mainplay/KingdomComplete');
})->name('mainplay.kingdom-complete');

Route::get('/mainplay/kingdom-complete-star', function () {
    return Inertia::render('mainplay/KingdomCompleteStar');
})->name('mainplay.kingdom-complete-star');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
