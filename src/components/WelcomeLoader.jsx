import React, { useState, useEffect } from "react";
import audio from "../utils/audioManager";

/**
 * WelcomeLoader — cinematic charging intro screen.
 *
 * A charger plug animates toward a wall socket, "connects",
 * then a 0→100% counter runs while a glow pulse plays.
 * Calls `onComplete()` once loading finishes.
 *
 * Everything is pure Tailwind + inline CSS keyframes — no libs.
 */
const WelcomeLoader = ({ onComplete }) => {
  /* ── state ─────────────────────────────────────────────── */
  const [plugged, setPlugged] = useState(false); // charger connected?
  const [percent, setPercent] = useState(0); // 0 → 100
  const [fadeOut, setFadeOut] = useState(false); // exit animation

  /* ── plug-in delay ─────────────────────────────────────── */
  useEffect(() => {
    // The CSS animation: 40% hold + approach + overshoot + bounce ≈ 1.5s
    // We mark "plugged" when the snap-in settles (matches the keyframe)
    const plugTimer = setTimeout(() => setPlugged(true), 1450);
    return () => clearTimeout(plugTimer);
  }, []);
  /* ── welcome audio: play immediately, audioManager handles unlock ── */
  useEffect(() => {
    audio.playWelcomeAudio();
  }, []);
  /* ── percentage counter (runs after plug connects) ─────── */
  useEffect(() => {
    if (!plugged) return;
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random-ish step (1-3) for a more organic feel
        return Math.min(prev + Math.ceil(Math.random() * 3), 100);
      });
    }, 60);
    return () => clearInterval(interval);
  }, [plugged]);

  /* ── trigger onComplete when done ──────────────────────── */
  useEffect(() => {
    if (percent === 100) {
      // Brief pause so user sees "100%", then fade out
      const doneTimer = setTimeout(() => {
        setFadeOut(true);
        audio.stopWelcomeAudio(); // fade-out the welcome sound
      }, 600);
      return () => clearTimeout(doneTimer);
    }
  }, [percent]);

  useEffect(() => {
    if (fadeOut) {
      // Wait for the CSS fade-out to finish, then resolve
      const exitTimer = setTimeout(() => {
        if (typeof onComplete === "function") {
          // onComplete can return or be used as a plain callback;
          // Home.jsx wraps it in a Promise so the intro waits.
          onComplete();
        }
      }, 800);
      return () => clearTimeout(exitTimer);
    }
  }, [fadeOut, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050510] transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ── inline keyframes (scoped via style tag) ──────── */}
      <style>{`
        /* Plug slides in: pause → accelerate → overshoot → snap back with bounce */
        @keyframes slidePlug {
          0%   { transform: translateX(-100px); }
          40%  { transform: translateX(-100px); }       /* hold off-screen */
          65%  { transform: translateX(-15px); }         /* slow approach */
          82%  { transform: translateX(6px); }            /* overshoot INTO socket */
          90%  { transform: translateX(-3px); }           /* bounce back */
          96%  { transform: translateX(2px); }            /* micro settle */
          100% { transform: translateX(0px); }            /* snap to final position */
        }

        /* Socket shakes on impact */
        @keyframes socketShake {
          0%   { transform: translate(0, 0); }
          15%  { transform: translate(2px, -1px); }
          30%  { transform: translate(-2px, 1px); }
          45%  { transform: translate(1px, 0px); }
          60%  { transform: translate(-1px, -1px); }
          75%  { transform: translate(1px, 0px); }
          100% { transform: translate(0, 0); }
        }

        /* Spark burst on connection */
        @keyframes sparkBurst {
          0%   { opacity: 0; transform: scale(.3); }
          20%  { opacity: 1; transform: scale(1.6); }
          50%  { opacity: .8; transform: scale(1.0); }
          70%  { opacity: .5; transform: scale(1.3); }
          100% { opacity: 0; transform: scale(.5); }
        }

        /* Individual spark particles fly outward */
        @keyframes sparkParticle {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: var(--spark-dir) scale(0); }
        }

        /* Electric arc flicker */
        @keyframes arcFlicker {
          0%, 100% { opacity: 0; }
          10%  { opacity: .9; }
          20%  { opacity: .2; }
          30%  { opacity: 1; }
          50%  { opacity: .4; }
          65%  { opacity: .8; }
          80%  { opacity: 0; }
        }

        /* Glow breathes when charging */
        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(34,211,238,.25));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 24px rgba(34,211,238,.9))
                    drop-shadow(0 0 48px rgba(59,130,246,.4));
            transform: scale(1.08);
          }
        }

        /* Subtle cable sway while idle */
        @keyframes cableSway {
          0%, 100% { d: path('M 0 30 Q 20 26, 55 30'); }
          50%      { d: path('M 0 30 Q 20 34, 55 30'); }
        }
      `}</style>

      {/* ── charger + socket illustration ─────────────────── */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Wall socket (right side — shakes on impact) */}
        <svg
          width="80"
          height="100"
          viewBox="0 0 80 100"
          className="relative z-10"
          style={
            plugged ? { animation: "socketShake .35s ease-out" } : undefined
          }
        >
          {/* Socket plate */}
          <rect
            x="10"
            y="10"
            width="60"
            height="80"
            rx="10"
            className="fill-gray-800 stroke-gray-600"
            strokeWidth="2"
          />
          {/* Socket holes (two vertical slots) */}
          <rect
            x="28"
            y="30"
            width="6"
            height="16"
            rx="2"
            className="fill-gray-950"
          />
          <rect
            x="46"
            y="30"
            width="6"
            height="16"
            rx="2"
            className="fill-gray-950"
          />
          {/* Ground hole */}
          <circle cx="40" cy="65" r="5" className="fill-gray-950" />
          {/* Subtle inner shadow ring */}
          <rect
            x="16"
            y="16"
            width="48"
            height="68"
            rx="7"
            className="fill-none stroke-gray-700/40"
            strokeWidth="1"
          />
        </svg>

        {/* Charger plug (left side, slides in with overshoot + snap) */}
        <div
          className="absolute z-20"
          style={{
            left: "50%",
            marginLeft: "-40px",
            animation: "slidePlug 1.5s cubic-bezier(.22,.68,.36,1) forwards",
          }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60">
            {/* Cable (curved path with subtle sway) */}
            <path
              d="M 0 30 Q 20 30, 55 30"
              className="stroke-cyan-400/60 fill-none"
              strokeWidth="4"
              strokeLinecap="round"
              style={
                !plugged
                  ? { animation: "cableSway 2s ease-in-out infinite" }
                  : undefined
              }
            />
            {/* Cable glow layer */}
            <path
              d="M 0 30 Q 20 30, 55 30"
              className="stroke-cyan-300/20 fill-none"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ filter: "blur(3px)" }}
            />
            {/* Plug body */}
            <rect
              x="50"
              y="14"
              width="30"
              height="32"
              rx="4"
              className="fill-gray-700 stroke-gray-500"
              strokeWidth="1.5"
            />
            {/* Grip ridges on plug body */}
            <line
              x1="56"
              y1="18"
              x2="56"
              y2="42"
              className="stroke-gray-600/50"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="18"
              x2="60"
              y2="42"
              className="stroke-gray-600/50"
              strokeWidth="1"
            />
            <line
              x1="64"
              y1="18"
              x2="64"
              y2="42"
              className="stroke-gray-600/50"
              strokeWidth="1"
            />
            {/* Plug prongs (two vertical) */}
            <rect
              x="82"
              y="19"
              width="5"
              height="10"
              rx="1"
              className="fill-gray-400"
            />
            <rect
              x="82"
              y="31"
              width="5"
              height="10"
              rx="1"
              className="fill-gray-400"
            />
            {/* Metallic shine on prongs */}
            <rect
              x="83"
              y="20"
              width="2"
              height="4"
              rx="0.5"
              className="fill-gray-300/40"
            />
            <rect
              x="83"
              y="32"
              width="2"
              height="4"
              rx="0.5"
              className="fill-gray-300/40"
            />
          </svg>
        </div>

        {/* Spark burst effect on connection */}
        {plugged && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: "50%",
              marginLeft: "-20px",
              top: "50%",
              marginTop: "-20px",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              {/* Central flash */}
              <circle
                cx="20"
                cy="20"
                r="8"
                className="fill-cyan-400/80"
                style={{
                  animation: "sparkBurst .6s ease-out forwards",
                  filter: "blur(1px)",
                }}
              />
              <circle
                cx="20"
                cy="20"
                r="4"
                className="fill-white"
                style={{ animation: "sparkBurst .5s ease-out forwards" }}
              />
              {/* Spark particles flying outward */}
              {[
                { dir: "translate(12px,-8px)", delay: "0s" },
                { dir: "translate(-10px,-10px)", delay: ".05s" },
                { dir: "translate(8px,12px)", delay: ".08s" },
                { dir: "translate(-12px,6px)", delay: ".03s" },
                { dir: "translate(14px,2px)", delay: ".06s" },
                { dir: "translate(-6px,-14px)", delay: ".1s" },
              ].map((s, i) => (
                <circle
                  key={i}
                  cx="20"
                  cy="20"
                  r="1.5"
                  className="fill-cyan-300"
                  style={{
                    "--spark-dir": s.dir,
                    animation: `sparkParticle .4s ${s.delay} ease-out forwards`,
                  }}
                />
              ))}
            </svg>
            {/* Electric arc lines */}
            <svg
              width="60"
              height="40"
              viewBox="0 0 60 40"
              className="absolute"
              style={{ left: "-10px", top: "0px" }}
            >
              <polyline
                points="20,20 25,12 30,22 35,10"
                className="stroke-cyan-300 fill-none"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ animation: "arcFlicker .4s ease-out forwards" }}
              />
              <polyline
                points="20,20 16,28 24,32 18,38"
                className="stroke-blue-400 fill-none"
                strokeWidth="1"
                strokeLinecap="round"
                style={{ animation: "arcFlicker .5s .1s ease-out forwards" }}
              />
            </svg>
          </div>
        )}

        {/* Glow pulse around socket when charging */}
        {plugged && (
          <div
            className="absolute inset-0 z-0 flex items-center justify-center"
            style={{ animation: "pulseGlow 1.8s ease-in-out infinite" }}
          >
            <div className="w-32 h-32 rounded-full bg-cyan-500/15 blur-2xl" />
            <div className="absolute w-20 h-20 rounded-full bg-blue-500/10 blur-xl" />
          </div>
        )}
      </div>

      {/* ── percentage / status text ─────────────────────── */}
      <div className="text-center">
        {!plugged ? (
          /* Before connection */
          <p className="text-gray-500 text-sm tracking-widest uppercase animate-pulse">
            Connecting…
          </p>
        ) : (
          /* After connection — show percentage */
          <>
            <p
              className="text-5xl font-extrabold tracking-tight tabular-nums"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {percent}%
            </p>
            <p className="text-gray-500 text-xs tracking-widest uppercase mt-2">
              {percent < 100 ? "Powering up…" : "Ready"}
            </p>

            {/* Thin progress bar */}
            <div className="mt-5 w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${percent}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* ── subtle tagline at bottom ─────────────────────── */}
      <p className="absolute bottom-8 text-gray-600 text-[11px] tracking-[.25em] uppercase">
        Sammy · Creative Developer
      </p>
    </div>
  );
};

export default WelcomeLoader;
