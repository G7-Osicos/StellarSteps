/**
 * Audio file paths for Stellar Steps.
 * Map page/step to voice, BGM, or SFX.
 */

const BASE = '/assets/audio';

export const AUDIO = {
    // Prologue
    prologueEnd: {
        voice: [
            `${BASE}/Leo/Where am I_ Is this….m4a`,
            `${BASE}/Marky/Marky 1.m4a`,
            `${BASE}/Leo/Waiting for me_ But I${'\u2019'}m just Leo….m4a`,
            `${BASE}/Marky/Marky 2.m4a`,
            `${BASE}/Marky/Marky 3.m4a`,
            `${BASE}/Marky/Marky 4.m4a`,
            `${BASE}/Leo/I${'\u2019'}m Ready! Let${'\u2019'}s Go!.m4a`,
        ],
    },

    // Kingdom (Chapter 1)
    kingdom2: {
        voice: [
            `${BASE}/Leo/Eww.m4a`,
            `${BASE}/Leo/Who is that_.m4a`,
            `${BASE}/Marky/Marky 6.m4a`,
            `${BASE}/Leo/Excuse me, Mr. King_ Why are you crying_.m4a`,
            `${BASE}/king/KING1.mp3`,
            `${BASE}/Leo/Wow! This is the same as my bedroom when mom scolds me….m4a`,
            `${BASE}/king/KING2.mp3`,
            `${BASE}/Leo/You know, it is not an impossible task when we do it together….m4a`,
        ],
    },

    kingdomEnd: {
        voice: [
            `${BASE}/king/KING3.mp3`,
            null,
            `${BASE}/king/KING4.mp3`,
            `${BASE}/Leo/Yea, King Crumble… you see.m4a`,
            `${BASE}/king/KING5.mp3`,
        ],
    },

    kingdomComplete: {
        voice: [
            `${BASE}/Marky/Marky 8.m4a`, // "You did it, Leo! You fixed the story! And look!"
            null,
            null,
            `${BASE}/Leo/Yes.m4a`, // "Yes! We got the Star of Order! One step closer to going home."
            `${BASE}/Marky/Marky 9.m4a`, // "Great job! But rejoice not, yet... the book comes round again! Hold on tight!"
        ],
    },

    // Whispering Woods (Chapter 2)
    whisper1: {
        voice: [`${BASE}/ins/Narrator8.m4a`],
    },

    whisper2: {
        voice: [
            `${BASE}/Leo/I don${'\u2019'}t like this place.m4a`,
            `${BASE}/Marky/Marky 10.m4a`, // "Don't worry, Leo. A hero is not a coward even when he is terrified. We must locate the Second Star."
            null, // Narrator SFX
        ],
    },

    whisper3: {
        voice: [
            `${BASE}/Leo/What was that_.m4a`,
            `${BASE}/ins/Narrator9.m4a`,
            `${BASE}/Leo/It${'\u2019'}s a monster. Run!.m4a`,
            `${BASE}/Marky/Marky 11.m4a`, // "Wait! Listen closely, Leo. It does not look like a nasty growl. That sounds like a..."
            null,
            `${BASE}/Leo/A cry_ It sounds sad.m4a`,
            `${BASE}/ins/Narrator10.m4a`, // Scene: Leo goes closer to the bush. A giant BLUE WOLF steps out...
            `${BASE}/whisper/(Audio) wofl1.m4a`, // Wolf: "Owoooo! It hurts! Please go away, little boy..."
        ],
        voiceVolume: [1.5, 1, 1, 1, 1, 1, 1, 1], // step 0 "What was that?!" - boost for quieter recording
    },

    whisper4: {
        voice: [
            `${BASE}/ins/Narrator11.m4a`, // "The Wolf is in pain. Leo wants to escape... What should Leo do?"
            `${BASE}/Marky/Marky 12.m4a`, // "He isn't a monster, Leo. He is hurt. But he is a wolf... is that bold enough to approach him?"
            `${BASE}/Leo/I${'\u2019'}m not scared. Are you okay, Mr. Wolf_.m4a`,
            `${BASE}/whisper/Copy of Wolf 2.m4a`, // Wolf: "You... you will help me? But I have big teeth! Aren't you afraid?"
            `${BASE}/Leo/My Lola says even large animals need assistance….m4a`,
        ],
    },

    whisper4End: {
        voice: [
            `${BASE}/ins/Narrator12.m4a`, // "The Wolf stands up. He doesn't look scary anymore. He is shaking his tail like a doggy pup."
            `${BASE}/whisper/Copy of Wolf 4.m4a`, // Wolf: "Thank you! Thank you, kind boy! The pain is gone!"
            `${BASE}/Leo/You${'\u2019'}re welcome! You aren${'\u2019'}t scary at all….m4a`, // "You're welcome! You aren't scary at all. You know, you are pretty fluffy."
            `${BASE}/whisper/Copy of wolf 5.m4a`, // Wolf: "I only growled, as I was sore. Only you cared to come and ask me how I was doing. You have a very kind heart."
            `${BASE}/Marky/Marky 14.m4a`, // "Leo showed Empathy. That means understanding how others feel!"
            `${BASE}/whisper/Copy of wolf 6.m4a`, // Wolf: "Please, take this. I had it stuck in my fur, but I believe it is yours."
        ],
    },

    whisper4EndStar: {
        voice: [
            `${BASE}/Marky/Marky 15.m4a`, // "Look! It's the Second Star!"
        ],
    },

    whisper4Game: {
        tweezer: `${BASE}/whisper/Tweezer.mp3`,
        wolfOuch: `${BASE}/whisper/Copy of Wolf 3.m4a`, // Wolf: "Ouch! ... Oh, that feels better already."
        sparkle: `${BASE}/whisper/Magic.mp3`, // "Sound: Sparkle! Sparkle!"
    },

    // Gate of Gratitude (Chapter 3)
    clouds1: {
        voice: [
            `${BASE}/ins/Narrator13.m4a`, // "Leo is almost there. He has scaled up and above the birds. But the wind is strong! It wants to push him back down."
            `${BASE}/Leo/It${'\u2019'}s… too… hard! I can${'\u2019'}t reach the top!.m4a`,
            `${BASE}/Marky/Marky 16.m4a`, // "Don't give up, Leo! Remember the Star of Order? Do you remember the Star of Kindness? You have come so far. Just one more big push!"
            `${BASE}/ins/Narrator14.m4a`, // "The wind is blowing hard. Leo requires your help in order to climb the mountain"
        ],
        bgm: `${BASE}/gateofgratitude/Strong wind mountains.wav`,
    },

    cloud2Game: {
        bgm: `${BASE}/gateofgratitude/mini game - platform.wav`,
    },

    cloud3: {
        voice: [
            `${BASE}/Leo/The Crystal Door! We made it, Marky!.m4a`, // "The Crystal Door! We made it, Marky! We have 2 Stars. All we want is to open the last one."
            `${BASE}/Marky/Marky 17.m4a`, // "Look! And there he is the last Star, and merged with the door!"
        ],
        voiceVolume: [1.5, 1], // boost Leo line (step 1) — make it louder
    },

    cloud4: {
        voice: [
            `${BASE}/Leo/Hey! Door! Open Up!….m4a`,
            `${BASE}/Leo/I said OPEN UP!.m4a`,
            `${BASE}/gateofgratitude/GATE1.mp3`, // Stone Guardians: "WHO IS SHOUTING? You are so noisy, little boy. Go away. I am sleeping."
            `${BASE}/Leo/But I have already written the other chapters!.m4a`,
            `${BASE}/gateofgratitude/GATE2.mp3`, // "Have to? I do not even need to do anything with rude children..."
            `${BASE}/Leo/Oh no… I${'\u2019'}m trapped forever..m4a`,
            `${BASE}/Marky/Marky 18.m4a`, // "Leo, you don't need magic power. You need Word Power. You tell Lola something you want, remember?"
            `${BASE}/Leo/Oh! I know what to do!.m4a`,
            `${BASE}/ins/Narrator15.m4a`, // "The Stone Guardian is waiting. Leo must get him to wake up. What should he say?"
        ],
        stoneGuardianSfx: `${BASE}/gateofgratitude/_WHO IS SHOUTING_ sfx Stone Guardian.wav`,
        sleepingStoneGuardian: `${BASE}/gateofgratitude/Sleeping Stone Guardian.wav`, // plays on Cloud4 load/reload
        grumpyStoneGuardian: `${BASE}/gateofgratitude/grumpy stone guardian.mp3`, // plays at end of step 5 voice
    },

    cloud5: {
        voice: [
            null, // Step 1: Direction
            null, // Step 2: Choice popup
            `${BASE}/Leo/Excuse me, PO, Mr. Guardian….m4a`, // Step 3: "Excuse me, po, Mr. Guardian? May I speak with you?"
            `${BASE}/gateofgratitude/gATE3NEW.m4a`, // Step 4: "Oh? That sounds much better. You used 'Po'. You are a respectful child. What do you need?"
            null, // Step 5: Direction
            null, // Step 6: Choice popup
            `${BASE}/Leo/Pls open the door po.m4a`, // Step 7: "Please open the door, po. I really miss my family."
            `${BASE}/gateofgratitude/GATE4NEW.m4a`, // Step 8: "Hmm. You are brave and polite. Very well. The Gate of Gratitude does not open to those who do not know how to ask nicely."
            null, // Steps 9–10: Door opening
            `${BASE}/Marky/Marky 20.m4a`, // Step 11: "You did it, Leo! You used the Magic Words!"
            null, // Step 12: Final Star
        ],
        bgm: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`,
        stoneGuardianCracks: `${BASE}/gateofgratitude/stone guardian cracks.mp3`, // SFX when door opens after step 8
        happyStoneGuardianStep4: `${BASE}/gateofgratitude/Happy Stone Guardian.wav`, // plays before step 4 narration (GATE3)
    },

    cloud6: {
        sfx: `${BASE}/gateofgratitude/Tap the star sfx.wav`,
    },

    epilogue1Attic: {
        voice: [
            null, // Step 1: Lola "Leo! Dinner time! Did you wash your hands?"
            `${BASE}/Leo/Opo, Lola! I${'\u2019'}m coming.m4a`, // Step 2: "Opo, Lola! I'm coming!"
            `${BASE}/ins/Narrator16.m4a`, // Step 3: "Leo climbs down the ladder. He is First Grader, though he is taller, a little, a little bolder... and a great deal more polite."
        ],
        bgm: `${BASE}/bgm/tunetank-medieval-happy-music-412790.mp3`, // plays on Epilogue1Attic load/reload
    },

    cloud6End: {
        voice: [
            null, // Step 0: auto-transition
            `${BASE}/Leo/Wait. I have to say one last thing..m4a`, // Step 1: "Wait. I have to say one last thing."
            `${BASE}/Leo/thanksleo.m4a`, // Step 2: "Thank you. Thank you for helping me."
            `${BASE}/Marky/Marky 21.m4a`, // Step 3: "You are welcome, Hero. Goodbye, Leo!"
        ],
    },

    // BGM tracks
    bgm: {
        main: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`,
        kingdom: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`,
        woods: `${BASE}/gateofgratitude/Strong wind mountains.wav`,
        chapter2: `${BASE}/whisper/Music for forest.mp3`, // Chapter2Intro reload through Whispering Woods
        chapter3: `${BASE}/gateofgratitude/The Gate of Gratitude Chapter music.wav`, // Chapter3Intro through Cloud2Game
        chapter3StrongWind: `${BASE}/gateofgratitude/Strong wind mountains.wav`, // Cloud3 onwards
    },

    // SFX
    sfx: {
        correct: `${BASE}/bgm/SFX - Correct.MP3`,
        incorrect: `${BASE}/bgm/SFX - incorrect.MP3`,
        star: `${BASE}/gateofgratitude/Tap the star sfx.wav`,
        starClick: `${BASE}/bgm/SFX - STAR FRAME 20.MP3`,
    },
};
