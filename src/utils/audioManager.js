/**
 * audioManager.js — centralised audio singleton.
 *
 * Three channels:
 *   welcome  → loading-page ambience (plays during WelcomeLoader)
 *   click    → short SFX on every user interaction
 *   scene    → looping background music for the 3D scene
 *
 * Audio elements are created eagerly with preload="auto" so they
 * buffer immediately.  A global unlock mechanism listens for the
 * first user-activation event and flushes any queued play requests,
 * ensuring audio begins at the earliest possible moment.
 *
 * Usage:
 *   import audio from "../utils/audioManager";
 *   audio.playWelcomeAudio();
 *   audio.playClickSound();
 *   audio.startSceneMusic();
 */

/* ── Audio file paths (from /public/audio/) ────────────────── */
const BASE = import.meta.env.BASE_URL; // e.g. "/M.Samuel.E_3D_Portfolio/"
const WELCOME_SRC = `${BASE}audio/loadingpage-sound.mp3`;
const CLICK_SRC = `${BASE}audio/mouse-click-sound.mp3`;
const SCENE_SRC = `${BASE}audio/techroom-background-sound.mp3`;

/* ── Eager audio creation ──────────────────────────────────── */
function makeAudio(src, { volume = 1, loop = false } = {}) {
  const el = new Audio(src);
  el.preload = "auto";
  el.volume = volume;
  el.loop = loop;
  el._want = false; // true while the app wants this to play
  return el;
}

let welcomeAudio = makeAudio(WELCOME_SRC, { volume: 0.7 });
const clickAudio = makeAudio(CLICK_SRC, { volume: 0.6 });
const sceneAudio = makeAudio(SCENE_SRC, { volume: 1.0, loop: true });

/* ── Global unlock / activation gate ───────────────────────── */
let unlocked = false;
const queue = []; // pending () => void

// Every event type that counts as "user activation" for autoplay
const ACTIVATION_EVENTS = [
  "click",
  "contextmenu",
  "auxclick",
  "dblclick",
  "mousedown",
  "mouseup",
  "pointerdown",
  "pointerup",
  "touchstart",
  "touchend",
  "keydown",
  "keyup",
];

function onActivation() {
  if (unlocked) return;
  unlocked = true;
  // Flush every queued play request
  while (queue.length) queue.shift()();
  // Tear down listeners
  ACTIVATION_EVENTS.forEach((e) =>
    document.removeEventListener(e, onActivation, { capture: true }),
  );
}

// Register on document in the capture phase so we catch everything
ACTIVATION_EVENTS.forEach((e) =>
  document.addEventListener(e, onActivation, {
    capture: true,
    passive: true,
  }),
);

/**
 * Try el.play(). If the browser blocks it, push a retry into the
 * queue so it fires the instant the user activates the page.
 * The `_want` flag prevents cancelled audio from replaying later.
 */
function smartPlay(el) {
  if (!el) return;
  const p = el.play();
  if (p && typeof p.catch === "function") {
    p.catch(() => {
      // Autoplay blocked — queue a retry if not yet unlocked
      if (!unlocked) {
        queue.push(() => {
          if (el.paused && el._want) el.play().catch(() => {});
        });
      }
    });
  }
}

/* ── Public API ────────────────────────────────────────────── */

const audioManager = {
  /* ─── Welcome page audio ─────────────────────────────────── */

  /** Start the welcome/loading-page sound.
   *  Safe to call multiple times — won't restart if already playing. */
  playWelcomeAudio() {
    if (!welcomeAudio || !welcomeAudio.paused) return;
    welcomeAudio._want = true;
    welcomeAudio.currentTime = 0;
    smartPlay(welcomeAudio);
  },

  /** Fade-out and stop the welcome sound. */
  stopWelcomeAudio() {
    if (!welcomeAudio) return;
    welcomeAudio._want = false; // prevent queued retry
    const el = welcomeAudio;
    const fade = setInterval(() => {
      if (el.volume > 0.05) {
        el.volume = Math.max(el.volume - 0.05, 0);
      } else {
        clearInterval(fade);
        el.pause();
        el.currentTime = 0;
        el.volume = 0.6; // reset for potential reuse
      }
    }, 40);
  },

  /* ─── Click SFX ──────────────────────────────────────────── */

  /** Play the click sound. Resets currentTime so rapid clicks
   *  overlap correctly without needing multiple Audio objects. */
  playClickSound() {
    clickAudio._want = true;
    clickAudio.currentTime = 0;
    smartPlay(clickAudio);
  },

  /* ─── Scene background music ─────────────────────────────── */

  /** Start the looping scene music. Safe to call multiple times;
   *  won't restart if already playing. */
  startSceneMusic() {
    if (!sceneAudio.paused) return;
    sceneAudio._want = true;
    smartPlay(sceneAudio);
  },

  /** Stop the scene music (e.g. user mutes / leaves). */
  stopSceneMusic() {
    sceneAudio._want = false;
    sceneAudio.pause();
    sceneAudio.currentTime = 0;
  },

  /** True if scene music is currently playing. */
  isSceneMusicPlaying() {
    return !sceneAudio.paused;
  },
};

/* ── Pause / resume when user leaves / returns to the tab ──── */
document.addEventListener("visibilitychange", () => {
  const allAudio = [welcomeAudio, clickAudio, sceneAudio];
  if (document.hidden) {
    // Tab is hidden → pause everything that's currently playing
    allAudio.forEach((el) => {
      if (el && !el.paused) {
        el._wasPlaying = true;
        el.pause();
      }
    });
  } else {
    // Tab is visible again → resume anything that was playing before
    allAudio.forEach((el) => {
      if (el && el._wasPlaying) {
        el._wasPlaying = false;
        if (el._want) el.play().catch(() => {});
      }
    });
  }
});

export default audioManager;
