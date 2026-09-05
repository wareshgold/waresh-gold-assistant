"use client";

import { useEffect, useRef, useState } from "react";

const DROP_COUNT = 46;

function createNoiseBuffer(context: AudioContext) {
  const length = context.sampleRate * 2;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * 0.32;
  }

  return buffer;
}

export default function AboutRainExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const drops = Array.from(root.querySelectorAll<HTMLElement>(".waresh-about-rain-drop"));

    const seed = drops.map((drop, index) => ({
      drop,
      x: ((index * 47) % 101) + ((index % 5) * 0.7),
      y: (index * 37) % 125,
      speed: 0.8 + ((index * 13) % 17) / 10,
      drift: ((index * 19) % 9) - 4,
      opacity: 0.13 + ((index * 23) % 17) / 100,
    }));

    seed.forEach(({ drop, x, y, speed, drift, opacity }) => {
      drop.style.left = `${x}%`;
      drop.style.top = `${y - 25}%`;
      drop.style.opacity = `${opacity}`;
      drop.style.setProperty("--waresh-rain-speed", `${speed}s`);
      drop.style.setProperty("--waresh-rain-drift", `${drift}px`);
    });

    if (reduceMotion) return;

    let animationFrame = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      seed.forEach((item) => {
        const current = Number.parseFloat(item.drop.dataset.y ?? "0") || 0;
        const next = current + item.speed * 72 * delta;
        const wrapped = next > 118 ? -18 : next;
        item.drop.dataset.y = `${wrapped}`;
        item.drop.style.transform = `translate3d(${item.drift}px, ${wrapped}vh, 0) rotate(16deg)`;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    seed.forEach((item) => {
      item.drop.dataset.y = `${item.y - 25}`;
    });

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
      gainRef.current?.disconnect();
      if (context) void context.close();
      sourceRef.current = null;
      gainRef.current = null;
      audioContextRef.current = null;
    };
  }, []);

  const toggleSound = async () => {
    if (soundEnabled) {
      const gain = gainRef.current;
      const context = audioContextRef.current;
      if (gain && context) {
        gain.gain.cancelScheduledValues(context.currentTime);
        gain.gain.setTargetAtTime(0, context.currentTime, 0.18);
      }
      setSoundEnabled(false);
      return;
    }

    const AudioContextConstructor = window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextConstructor) return;

    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;

    if (context.state === "suspended") await context.resume();

    if (!sourceRef.current) {
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const highpass = context.createBiquadFilter();
      const gain = context.createGain();

      source.buffer = createNoiseBuffer(context);
      source.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = 5200;
      filter.Q.value = 0.45;
      highpass.type = "highpass";
      highpass.frequency.value = 900;
      highpass.Q.value = 0.25;
      gain.gain.value = 0;

      source.connect(highpass).connect(filter).connect(gain).connect(context.destination);
      source.start();

      sourceRef.current = source;
      gainRef.current = gain;
    }

    const gain = gainRef.current;
    gain?.gain.cancelScheduledValues(context.currentTime);
    gain?.gain.setTargetAtTime(0.018, context.currentTime, 0.55);
    setSoundEnabled(true);
  };

  return (
    <div ref={rootRef} className="waresh-about-rain-layer" aria-hidden="true">
      {Array.from({ length: DROP_COUNT }, (_, index) => (
        <span key={index} className="waresh-about-rain-drop" />
      ))}

      <div className="waresh-about-rain-vignette" />

      <button
        type="button"
        className="waresh-about-sound-control"
        aria-hidden="false"
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
