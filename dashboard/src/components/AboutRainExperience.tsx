"use client";

import { useEffect, useState, type CSSProperties } from "react";

const DROP_COUNT = 52;

type RainStyle = CSSProperties & {
  "--waresh-about-drift": string;
  "--waresh-about-duration": string;
  "--waresh-about-delay": string;
};

function createRainAudio(): HTMLAudioElement {
  const rainAudio = new Audio("/rain-forest.mp3");
  rainAudio.loop = true;
  rainAudio.preload = "auto";
  rainAudio.volume = 0.16;
  return rainAudio;
}

function stopRainAudio(rainAudio: HTMLAudioElement): void {
  rainAudio.pause();
  rainAudio.currentTime = 0;
}

export default function AboutRainExperience() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    return () => {
      if (audio) stopRainAudio(audio);
    };
  }, [audio]);

  const toggleSound = async () => {
    if (soundEnabled) {
      if (audio) stopRainAudio(audio);
      setSoundEnabled(false);
      return;
    }

    const nextAudio = audio ?? createRainAudio();

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
          top: 0;
          left: 0;
          width: 1.5px;
          height: 58px;
          border-radius: 999px;
          background: linear-gradient(180deg, transparent, rgba(232, 241, 234, 0.76), transparent);
          box-shadow: 0 0 5px rgba(232, 241, 234, 0.08);
          transform: translate3d(0, -18vh, 0) rotate(16deg);
          animation-name: waresh-about-rain-fall;
          animation-duration: var(--waresh-about-duration);
          animation-delay: var(--waresh-about-delay);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          will-change: transform;
        }

        @keyframes waresh-about-rain-fall {
          from {
            transform: translate3d(var(--waresh-about-drift), -18vh, 0) rotate(16deg);
          }
          to {
            transform: translate3d(calc(var(--waresh-about-drift) + 7vw), 128vh, 0) rotate(16deg);
          }
        }

        .waresh-about-rain-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 52% 42%, transparent 18%, rgba(7, 20, 15, 0.24) 100%);
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

      {Array.from({ length: DROP_COUNT }, (_, index) => {
        const left = ((index * 61.73 + 13) % 108) - 4;
        const top = ((index * 43.17 + 7) % 118) - 18;
        const duration = 2.8 + ((index * 17) % 24) / 10;
        const delay = -(((index * 29) % 64) / 10);
        const drift = ((index * 19) % 13) - 6;
        const length = 42 + ((index * 23) % 31);
        const opacity = 0.18 + ((index * 11) % 23) / 100;

        const style: RainStyle = {
          left: `${left}%`,
          top: `${top}vh`,
          height: `${length}px`,
          opacity,
          "--waresh-about-drift": `${drift}px`,
          "--waresh-about-duration": `${duration}s`,
          "--waresh-about-delay": `${delay}s`,
        };

        return <span key={index} className="waresh-about-rain-drop" style={style} aria-hidden="true" />;
      })}

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
