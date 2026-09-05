"use client";

import { useEffect, useRef, useState } from "react";

const DROP_COUNT = 46;

function createRainBuffer(context: AudioContext) {
  const duration = 8;
  const length = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(2, length, context.sampleRate);

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);

    for (let index = 0; index < length; index += 1) {
      data[index] = 0;
    }

    const dropCount = 520 + channel * 80;
    for (let drop = 0; drop < dropCount; drop += 1) {
      const start = Math.floor(Math.random() * (length - 2200));
      const amplitude = 0.018 + Math.random() * 0.045;
      const durationSamples = 350 + Math.floor(Math.random() * 1500);
      const frequency = 1200 + Math.random() * 4200;

      for (let offset = 0; offset < durationSamples && start + offset < length; offset += 1) {
        const envelope = Math.exp(-offset / (durationSamples * 0.22));
        const tone = Math.sin((2 * Math.PI * frequency * offset) / context.sampleRate);
        const softNoise = Math.random() * 2 - 1;
        data[start + offset] += amplitude * envelope * (tone * 0.28 + softNoise * 0.72);
      }
    }
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
      x: ((index * 47) % 101) + (index % 5) * 0.7,
      y: (index * 37) % 125 - 25,
      speed: 52 + ((index * 13) % 34),
      drift: ((index * 19) % 9) - 4,
      opacity: 0.16 + ((index * 23) % 17) / 100,
    }));

    seed.forEach(({ drop, x, y, opacity }) => {
      drop.style.left = `${x}%`;
      drop.style.top = "0";
      drop.style.opacity = `${opacity}`;
      drop.style.setProperty("--waresh-rain-y", `${y}vh`);
    });

    if (reduceMotion) {
      seed.forEach(({ drop, drift }) => {
        drop.style.transform = `translate3d(${drift}px, var(--waresh-rain-y), 0) rotate(16deg)`;
      });
      return;
    }

    let animationFrame = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      seed.forEach((item) => {
        const current = Number.parseFloat(item.drop.dataset.y ?? `${item.y}`) || item.y;
        const next = current + item.speed * delta;
        const wrapped = next > 118 ? -18 : next;
        item.drop.dataset.y = `${wrapped}`;
        item.drop.style.transform = `translate3d(${item.drift}px, ${wrapped}vh, 0) rotate(16deg)`;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    seed.forEach((item) => {
      item.drop.dataset.y = `${item.y}`;
    });

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    return () => {
      const context = audioContextRef.current;
      try {
        sourceRef.current?.stop();
      } catch {
        // The source may already be stopped.
      }
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
        gain.gain.setTargetAtTime(0, context.currentTime, 0.2);
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
      const lowpass = context.createBiquadFilter();
      const highpass = context.createBiquadFilter();
      const gain = context.createGain();

      source.buffer = createRainBuffer(context);
      source.loop = true;
      highpass.type = "highpass";
      highpass.frequency.value = 450;
      highpass.Q.value = 0.35;
      lowpass.type = "lowpass";
      lowpass.frequency.value = 7200;
      lowpass.Q.value = 0.25;
      gain.gain.value = 0;

      source.connect(highpass).connect(lowpass).connect(gain).connect(context.destination);
      source.start();

      sourceRef.current = source;
      gainRef.current = gain;
    }

    const gain = gainRef.current;
    gain?.gain.cancelScheduledValues(context.currentTime);
    gain?.gain.setTargetAtTime(0.022, context.currentTime, 0.7);
    setSoundEnabled(true);
  };

  return (
    <div ref={rootRef} className="waresh-about-rain-layer">
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
