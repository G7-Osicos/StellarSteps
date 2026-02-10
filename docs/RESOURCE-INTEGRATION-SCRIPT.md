# Stellar Steps — Resource Integration & Tech Stack Script

**Use this script for the capstone defense when explaining how resources (sounds, images, tech) are integrated into the system and why the chosen technologies are suitable.**

---

## Part 1: Introduction to Resource Integration

"In Stellar Steps, resources fall into three main categories: **audio** (voice, BGM, and sound effects), **images** (backgrounds, characters, UI elements), and **code assets** (React components, CSS, and configuration). All of these are integrated so that the story and gameplay feel consistent and perform well in the browser."

---

## Part 2: How Audio Is Integrated

### Where the files live

"All audio files are stored under **public/assets/audio/** in the Laravel project. We don’t put them inside the JavaScript bundle; they stay as static files so the server can serve them directly. This keeps the initial page load small and lets us add or replace audio without rebuilding the app.

"We organize by purpose: **Leo** and **Marky** for character voice lines, **king** for the king’s dialogue, **gateofgratitude** for that chapter’s BGM and SFX, **whisper** for the forest chapter, and **bgm** for shared music and effects. We use **MP3** and **M4A** so that all major browsers can play them without extra plugins."

### Central audio config

"Instead of hardcoding file paths in every scene, we use a **central config file**: **resources/js/config/audio.js**. This file exports one object, **AUDIO**, that maps each scene or chapter to its clips. For example, `AUDIO.kingdom2.voice` is an array of voice URLs for each step of that scene; `AUDIO.cloud5.bgm` is the background music for the Gate of Gratitude scene. Some entries also have **voiceVolume** arrays so we can boost quieter recordings per step.

"This approach gives us a single place to fix paths or swap files. The React pages don’t care about the actual URLs; they only use keys like `AUDIO.whisper3.voice[step]`."

### Audio context and playback

"The actual playback is handled by a **React Context** called **AudioContext** in **resources/js/contexts/AudioContext.jsx**. It provides:

- **playBGM** and **stopBGM** for looping background music  
- **playAmbient** for ambient loops (e.g., wind)  
- **playVoice** and **stopVoice** for dialogue, with optional volume multiplier and callback when a clip ends  
- **playSFX** for one-shot effects like correct/incorrect or star clicks  

"The context keeps refs to the current BGM, ambient, voice, and SFX. When **playVoice** is called, it temporarily **ducks** the BGM to about 25% so the voice is clear, then restores it when the voice ends. Volume and mute come from **SettingsContext**, which reads from **localStorage**, so the user’s choices persist and apply to all audio."

### How a scene uses audio

"In a typical scene—for example **Whisper3** or **Cloud5**—the component imports **useAudio** and **AUDIO**. In a **useEffect** that depends on the current **step** (or phase), it looks up the clip for that step, e.g. `AUDIO.whisper3.voice[step]`, and if it exists, calls **playVoice(src, volumeMultiplier)**. For BGM, the scene might call **playBGM(AUDIO.bgm.chapter2)** once on mount and **stopBGM** on unmount. So the **integration** is: config defines *what* to play, context defines *how* to play it, and each page ties playback to its own state (step/phase)."

### Handling spaces and special characters in filenames

"Some audio filenames contain spaces or special characters. In the context we use **encodeURI** on the path before creating the **Audio** object so the browser can request the file correctly."

---

## Part 3: How Images and Static Assets Are Integrated

"Images live under **public/assets/img/** (e.g., **Star.webp**, **Graystar.webp**, character art, backgrounds). We reference them by **absolute path from the site root**, e.g. **/assets/img/Star.webp**, in the React components. That way they work the same in development and production without going through the Vite bundle.

"We have scripts in **scripts/** for optimization: **convert-images-to-webp.mjs** and **responsive-images.mjs**, so we can generate WebP and responsive variants to keep load times and data usage reasonable, especially on the welcome/start screens where the README suggests compressing large assets like **title.png** and **Book.png**."

---

## Part 4: Tech Stack and Why It Fits This Project

### Backend: Laravel (PHP)

"We use **Laravel** as the backend framework. It gives us:

- **Routing** in **routes/web.php**: each game scene is a route that returns an Inertia page with optional props.  
- **Authentication**: we extended Laravel’s auth with **StellarAuthController** for Hero and Guardian sign-up and login (name + 4-digit PIN, hashed like a password).  
- **Database**: migrations for **users** (role, age, hero_code, stages_completed, gold_stars). Progress is saved and loaded in **MainplayController**.  
- **Session and middleware**: the progress-saving endpoint is protected by the **auth** middleware so only logged-in users persist data.

"Laravel is a good fit for this capstone because it’s well-documented, has built-in auth and migrations, and runs on typical PHP hosting (e.g., XAMPP) and on Railway for deployment."

### Frontend: Inertia + React

"We use **Inertia.js** with **React**. Inertia sits between Laravel and React: the server still controls routes and returns **Inertia::render('mainplay/SceneName', props)** instead of JSON. The client loads the matching React component and receives the props. So we get a **single-page-app feel**—no full page reloads—without building a separate REST API. All our game pages are React components under **resources/js/Pages/mainplay/**.

"This is good for our project because we have many scenes and shared state (audio, settings). One React app with contexts and one Laravel app keep the architecture simple and the flow of data clear."

### Styling: Tailwind CSS

"Styling is done with **Tailwind CSS** and custom CSS in **resources/css/app.css**. We use Tailwind for layout, spacing, and responsiveness. In **app.css** we add project-specific styles: custom fonts (e.g., Comfortaa, Patrick Hand), keyframe animations (e.g., title glow, star unlock), and utility classes like **narration-text** that respect the **--narration-text-size** variable set from **SettingsContext**. So the **integration** of resources here is: Tailwind for structure, custom CSS for theme and accessibility (e.g., text size, brightness)."

### Build: Vite

"The frontend is built with **Vite**. The **vite.config.js** uses **laravel-vite-plugin** and **@vitejs/plugin-react** so that **resources/js/app.jsx** is the entry point and React + CSS are bundled. The Blade layout (**resources/views/app.blade.php**) includes **@vite(['resources/js/app.jsx', ...])** so in production the correct hashed assets are loaded. Audio and images in **public/** are **not** imported in JS; they’re loaded at runtime by URL, which keeps the bundle size down and makes it easy to add or change media without rebuilding."

---

## Part 5: Why This Stack Is Good for This Project

"**Laravel + Inertia + React** gives us:

1. **One codebase**: backend and frontend in one repo; no separate API layer for every screen.  
2. **Familiar backend**: PHP and Laravel are widely taught and hosted; easy to run locally (e.g., XAMPP) and deploy (e.g., Railway).  
3. **Rich frontend**: React and contexts let us manage audio and settings globally and keep each scene focused on story and UI.  
4. **Controlled loading**: Static assets in **public/** are served by the server; only JS and CSS are bundled by Vite, so we can optimize images and audio independently.

"The **audio design**—central config plus a single AudioContext—keeps playback consistent, avoids duplicate logic in every page, and makes it straightforward to add new scenes or new clips. The **resource integration** is therefore: **config and context in the frontend**, **static files in public**, and **data (progress) and auth in the backend**, all working together so the story and sounds feel integrated and maintainable."

---

## Part 6: Short Summary (30–60 seconds)

"If I had to summarize how resources are integrated: **Audio** is defined in a central **audio.js** config and played through a shared **AudioContext**; **images** and audio files sit in **public/assets/** and are referenced by URL so they don’t bloat the JS bundle. The **tech stack** is **Laravel** for routes, auth, and progress; **Inertia + React** for a smooth single-page experience without a separate API; **Tailwind** and custom CSS for layout and accessibility; and **Vite** for building the frontend. Together, this keeps the project manageable for a capstone while still delivering an integrated, story-driven experience with sound and progress saving."

---

*Use this script as a spoken narrative or adapt it into slides for the defense. Adjust examples (e.g., scene names) to match your actual presentation.*
