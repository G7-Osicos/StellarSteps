# Stellar Steps — Capstone Defense: Possible Questions & Answers

Use these as a guide for your oral defense. Adapt wording to your style and add project-specific details (e.g., exact chapter names, learning outcomes).

---

## 1. Project Overview & Purpose

**Q: What is Stellar Steps, and what problem does it solve?**

**A:** Stellar Steps is an interactive, story-based educational web application designed for young learners. It follows the adventure of Leo and his companion Marky through chapters (Prologue, Kingdom, Whispering Woods, Gate of Gratitude, Epilogue). The system teaches values such as order, kindness, empathy, and gratitude through narrative and simple gameplay. It addresses the need for age-appropriate, engaging digital learning that works in browsers without requiring app store installation.

---

**Q: Who are the target users?**

**A:** Primary users are children (heroes) who play through the story, and guardians (parents or educators) who can create accounts and link to a hero via a unique Hero Code. Heroes have progress saved (stages completed, gold stars); guardians can monitor or support the same hero using that code.

---

**Q: What are the main features of the system?**

**A:** Main features include: (1) Role-based authentication—Hero and Guardian sign-up and login with name and 4-digit PIN; (2) Story progression across multiple chapters and scenes with narration, dialogue, and choices; (3) Voice acting and sound effects—BGM, character voice lines, and SFX keyed to story steps; (4) Progress tracking—cleared stages and gold stars (0–3) persisted for logged-in users; (5) Accessibility and settings—adjustable text size, screen brightness, and volume/mute, stored in the browser; (6) Responsive, fullscreen-friendly UI with an adventure map and menu.

---

## 2. Technical Stack & Architecture

**Q: What technologies did you use, and why?**

**A:** We used **Laravel** (PHP) for the backend: routing, authentication, database, and API for saving progress. **Inertia.js** with **React** for the frontend so we get a single-page-app experience without building a separate REST API—Laravel returns Inertia pages and the same backend handles form submissions and progress. **Vite** bundles our React and CSS. **Tailwind CSS** for styling and responsive layout. We chose this stack because it is well-documented, suitable for capstone scope, allows fast iteration, and Laravel’s ecosystem (Breeze, Sanctum, migrations) gave us auth and data modeling out of the box.

---

**Q: Why Laravel instead of Node.js or another backend?**

**A:** Laravel provides a full MVC stack, built-in auth (we extended it for Hero/Guardian and PIN-based login), migrations for database schema, and Inertia’s first-class support so we don’t need a separate SPA backend. It also runs on common hosting (e.g., XAMPP, Railway) and fits a PHP-based curriculum if that’s part of our program.

---

**Q: Why React with Inertia instead of a separate React SPA with REST API?**

**A:** Inertia lets us keep one codebase: Laravel handles routes and controllers, and returns Inertia “page” responses that load the corresponding React component with props. We avoid maintaining a separate API for every screen and get shared auth/session seamlessly. The frontend feels like an SPA (no full page reloads) while still being driven by server-side routing and data.

---

**Q: How is the application structured (high-level architecture)?**

**A:** The browser talks to a single Laravel app. Routes in `web.php` define URLs; for the game, most routes return `Inertia::render('mainplay/SceneName', props)`. The React app is wrapped in Settings and Audio providers. Each scene (e.g., Kingdom1, Whisper3, Cloud5) is a React page that uses the audio context and an audio config file that maps scene/step to voice and SFX paths. Progress is stored in the `users` table (stages_completed JSON, gold_stars); guests can play but progress is not persisted. Static assets (audio, images) live in `public/assets/` and are referenced by path in the frontend.

---

## 3. Audio & Resource Integration

**Q: How did you integrate sounds (BGM, voice, SFX) into the system?**

**A:** All audio file paths are centralized in `resources/js/config/audio.js`. Each scene or chapter has an entry (e.g., `AUDIO.kingdom2`, `AUDIO.cloud5`) with arrays of voice URLs and optional BGM/SFX URLs. The React app uses an **AudioContext** (React context) that provides `playBGM`, `playVoice`, `playSFX`, `playAmbient`, and `stop*` functions. Scene components import `AUDIO` and `useAudio()`, and in `useEffect` they play the correct clip when the step or phase changes. Volume and mute come from **SettingsContext** (persisted in localStorage), so one control affects all playback.

---

**Q: Why use a central config file for audio instead of hardcoding in each page?**

**A:** Centralizing paths in `audio.js` makes it easy to add or change files in one place, avoid typos and duplicate URLs, and keep scene-to-audio mapping clear. Pages only reference keys like `AUDIO.whisper3.voice[step]`, so swapping a file or fixing a path is done once.

---

**Q: How do you handle different audio types (BGM vs voice vs SFX)?**

**A:** The AudioContext keeps separate refs for BGM, ambient, voice, and SFX. BGM and ambient can loop and are ducked (reduced in volume) when voice plays so dialogue is clear. Voice and SFX are one-shots. When the user changes volume or mute in settings, the context updates all active Audio objects so behavior is consistent across the app.

---

**Q: Where are the audio files stored, and how are they loaded?**

**A:** Audio files are stored under `public/assets/audio/` (e.g., by character: Leo, Marky, king; by chapter: gateofgratitude, whisper, bgm). They are served as static files by the web server. The frontend uses the HTML5 Audio API (`new Audio(url)`); paths in config are relative to the site root (e.g., `/assets/audio/Leo/...`). We use formats like MP3 and M4A for broad browser support.

---

## 4. Data & Progress

**Q: How is user progress saved and retrieved?**

**A:** For logged-in users, progress is stored in the `users` table: `stages_completed` (JSON array of five booleans for prologue/chapter completion) and `gold_stars` (0–3). The Mainplay page is loaded via `MainplayController@index`, which reads the user’s saved progress and can also update it from URL query params (e.g., when returning from a “chapter complete” scene). Progress can also be sent explicitly via POST to `mainplay/progress` (saveProgress). Guests get progress derived only from the URL for that session; nothing is persisted.

---

**Q: What is the Hero Code, and how does it work?**

**A:** When a Hero account is created, the system generates a unique Hero Code (e.g., G4K2-M9P1). Guardians register or log in and can link to a hero by entering that code. The code is stored only on the hero’s user record; guardians use it to find and associate with that hero for login and (in the future) viewing progress.

---

**Q: Why use JSON for stages_completed?**

**A:** We have a fixed number of stages (e.g., five) representing prologue and chapter completion. Storing them as a JSON array of booleans keeps the schema simple and allows the backend to validate and update the array as a whole. Laravel’s cast to `array` on the User model makes it easy to read and write in PHP.

---

## 5. Security & Authentication

**Q: How is authentication implemented?**

**A:** We use Laravel’s built-in auth (session-based). We extended it with a custom **StellarAuthController** for Hero and Guardian registration and login. Heroes register with name, age, and 4-digit PIN; guardians with name, hero code, and PIN. Passwords are hashed with Laravel’s Hash (bcrypt). The login checks role, name, and PIN. Session is regenerated on login. Progress-saving endpoint is protected by `auth` middleware so only logged-in users can persist progress.

---

**Q: How do you secure the 4-digit PIN?**

**A:** The PIN is treated as a password: it’s hashed with Laravel’s Hash (bcrypt) and stored in the `password` column. We never store or log the raw PIN. Validation ensures it’s exactly 4 digits.

---

## 6. Challenges & Solutions

**Q: What was the most challenging part of the project?**

**A:** (Adapt to your experience.) Examples: (1) **Audio sync**—making sure voice lines and BGM start/stop at the right story step and don’t overlap badly; we solved this with a single AudioContext and step-based effects. (2) **Progress consistency**—keeping URL-based completion and database progress in sync; we handled it in MainplayController by applying URL params then saving. (3) **Cross-browser audio**—some browsers require user interaction before playing; we use `.catch()` on `play()` and design so first play happens after user tap/click.

---

**Q: How did you ensure the application works on different devices?**

**A:** We use Tailwind for responsive layout, relative units and breakpoints, and a fullscreen-friendly layout (overflow hidden, 100% height). Settings allow text size and brightness adjustment. We avoid fixed pixel sizes for critical UI so it scales. Audio is handled with standard Web Audio/HTML5 Audio supported in modern browsers.

---

## 7. Testing & Deployment

**Q: How can the project be run locally?**

**A:** After cloning the repo: run `composer install` and `npm install`, copy `.env.example` to `.env`, run `php artisan key:generate` and `php artisan migrate`. Start the backend with `php artisan serve` and the frontend with `npm run dev`. Open the URL from `php artisan serve` (e.g., http://127.0.0.1:8000). For MySQL (e.g., XAMPP), set DB_* in `.env` and run migrations again.

---

**Q: How is the project deployed?**

**A:** The app is set up for deployment on **Railway** using the provided Dockerfile and `railway.toml`. We connect the GitHub repo, set environment variables (APP_KEY, APP_URL, DB_* for MySQL if used), and Railway builds and runs the app. Migrations run as part of the deploy process.

---

## 8. Future Work & Limitations

**Q: What would you add or improve in the future?**

**A:** (Examples.) (1) Guardian dashboard to view hero progress and gold stars. (2) More granular progress (e.g., per-scene or per-mini-game). (3) Preloading critical audio for the next scene to reduce delay. (4) Offline support or PWA so the story can be played without constant connectivity. (5) Analytics (e.g., time per chapter) for research or improvement.

---

**Q: What are the current limitations?**

**A:** Guest progress is not saved. Audio autoplay may be blocked until the user interacts. Some older browsers might not support all features. The app assumes a stable connection for loading assets and saving progress.

---

## 9. Learning Outcomes & Contribution

**Q: What did you learn from this project?**

**A:** (Personalize.) Integration of a full stack (Laravel, Inertia, React), design of an audio system with context and config, role-based auth and progress persistence, responsive and accessible UI considerations, and deployment (e.g., Railway) and environment configuration.

---

**Q: What is your specific contribution to the team/capstone?**

**A:** (Fill in your role: e.g., backend APIs and progress logic, audio integration and config, frontend scenes and routing, deployment and DevOps, UI/UX and accessibility, etc.)

---

*End of Q&A. Good luck with your defense!*
