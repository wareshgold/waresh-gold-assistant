"use client";

import { useEffect, useState } from "react";

const DROP_COUNT = 46;

export default function AboutRainExperience() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".waresh-about-rain-layer");
    if (!root) return;

    const drops = Array.from(root.querySelectorAll<HTMLElement>(".waresh-about-rain-drop"));

    drops.forEach((drop, index) => {
      const x = ((index * 47) % 101) + (index % 5) * 0.7;
      const y = (index * 37) % 125 - 25;
      const duration = 2.4 + ((index * 17) % 18) / 10;
      const delay = -((index * 29) % 38) / 10;
      const drift = ((index * 19) % 9) - 4;
      const opacity = 0.16 + ((index * 23) % 17) / 100;

      drop.style.left = `${x}%`;
      drop.style.top = `${y}vh`;
      drop.style.opacity = `${opacity}`;
      drop.style.setProperty("--waresh-rain-drift", `${drift}px`);
      drop.style.setProperty("--waresh-rain-duration", `${duration}s`);
      drop.style.setProperty("--waresh-rain-delay", `${delay}s`);
    });

    return () => {
      drops.forEach((drop) => {
        drop.style.animationPlayState = "paused";
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const toggleSound = async () => {
    if (soundEnabled) {
      audio?.pause();
      if (audio) audio.currentTime = 0;
      setSoundEnabled(false);
      return;
    }

    // Real recorded ambience is intentionally used here instead of generated
    // Web Audio noise. The approved recording should live at this public path.
    const nextAudio = audio ?? new Audio("/rain-forest.mp3");
    nextAudio.loop = true;
    nextAudio.preload = "auto";
    nextAudio.volume = 0.16;

    try {
      await nextAudio.play();
      if (!audio) setAudio(nextAudio);
      setSoundEnabled(true);
    } catch {
      setSoundEnabled(false);
    }
  };

  return (
    <div className="waresh-about-rain-layer" aria-hidden="false">
      <style>{`
        .waresh-about-rain-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .waresh-about-rain-drop {
          position: absolute;
          left: 0;
          width: 1.5px;
          height: 58px;
          border-radius: 999px;
          background: linear-gradient(180deg, transparent, rgba(232, 241, 234, 0.78), transparent);
          box-shadow: 0 0 4px rgba(232, 241, 234, 0.08);
          transform: translate3d(0, 0, 0) rotate(16deg);
          animation: waresh-about-rain-fall var(--waresh-rain-duration, 3s) linear var(--waresh-rain-delay, 0s) infinite;
          will-change: transform;
        }

        @keyframes waresh-about-rain-fall {
          from {
            transform: translate3d(var(--waresh-rain-drift, 0px), -18vh, 0) rotate(16deg);
          }
          to {
            transform: translate3d(calc(var(--waresh-rain-drift, 0px) + 5vw), 128vh, 0) rotate(16deg);
          }
        }

        .waresh-about-rain-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 52% 42%, transparent 20%, rgba(7, 20, 15, 0.22) 100%);
        }

        .waresh-about-sound-control {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 999px;
          background: rgba(20, 38, 30, .72);
          color: rgba(255,255,255,.88);
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          backdrop-filter: blur(12px);
          pointer-events: auto;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .waresh-about-rain-drop {
            width: 1.25px;
            height: 46px;
          }

          .waresh-about-sound-control {
            right: 12px;
            bottom: 12px;
            min-height: 38px;
            padding-inline: 12px;
            font-size: 10px;
          }
        }
      `}</style>

      {Array.from({ length: DROP_COUNT }, (_, index) => (
        <span key={index} className="waresh-about-rain-drop" aria-hidden="true" />
      ))}

      <div className="waresh-about-rain-vignette" aria-hidden="true" />

      <button
        type="button"
        className="waresh-about-sound-control"
        aria-label={soundEnabled ? "خاموش کردن صدای باران" : "پخش صدای باران"}
        aria-pressed={soundEnabled}
        onClick={(event) => {
          event.stopPropagation();
          void toggleSound();
        }}
      >
        <span aria-hidden="true">{soundEnabled ? "◉" : "◌"}</span>
        <span>{soundEnabled ? "صدای باران روشن" : "صدای باران"}</span>
      </button>
    </div>
  );
}
