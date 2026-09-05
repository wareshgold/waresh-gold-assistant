"use client";

import { useEffect, type ReactNode } from "react";

type ScrollExperienceProps = { children: ReactNode };

const HERO_SLOGANS = [
  "طلا را فقط برای امروز نخر.",
  "زیبایی، وقتی ماندگار می‌شود که ارزشمند باشد.",
  "طلا، انتخابی برای امروز و ارزشی برای فردا.",
  "ظرافتی که دیده می‌شود، ارزشی که می‌ماند.",
  "وارش گلد؛ جایی میان زیبایی و ارزش.",
];

function setupHeroSlogan(hero: HTMLElement, reduceMotion: boolean): () => void {
  const heading = hero.querySelector<HTMLElement>("h1");
  if (!heading) return () => undefined;

  const originalHtml = heading.innerHTML;
  const rotator = document.createElement("span");
  rotator.className = "waresh-hero-slogan-rotator";
  rotator.setAttribute("aria-live", "polite");
  rotator.textContent = HERO_SLOGANS[0];

  heading.replaceChildren(rotator);

  let timerId: number | undefined;
  let index = 0;
  let stopped = false;

  const showNext = () => {
    if (stopped) return;

    index = (index + 1) % HERO_SLOGANS.length;

    if (reduceMotion) {
      rotator.textContent = HERO_SLOGANS[index];
      return;
    }

    rotator.classList.add("is-changing");
    window.setTimeout(() => {
      if (stopped) return;
      rotator.textContent = HERO_SLOGANS[index];
      rotator.classList.remove("is-changing");
    }, 420);
  };

  if (!reduceMotion) {
    timerId = window.setInterval(showNext, 6000);
  }

  return () => {
    stopped = true;
    if (timerId !== undefined) window.clearInterval(timerId);
    heading.innerHTML = originalHtml;
  };
}

function setupHeroRain(hero: HTMLElement): () => void {
  const rain = hero.querySelector<HTMLElement>(".waresh-rain");
  if (!rain) return () => undefined;

  rain.classList.remove("waresh-rain");
  rain.classList.add("waresh-rain-runtime");

  rain.querySelectorAll(".waresh-rain-drop").forEach((drop) => drop.remove());

  const isMobile = window.innerWidth <= 640;
  const count = isMobile ? 34 : 72;
  const width = Math.max(rain.clientWidth, window.innerWidth, 320);
  const height = Math.max(rain.clientHeight, window.innerHeight, 620);

  const drops: HTMLSpanElement[] = [];

  for (let i = 0; i < count; i += 1) {
    const drop = document.createElement("span");
    drop.className = "waresh-rain-drop";

    const x = ((i * 83.17 + 31) % (width + 180)) - 90;
    const y = ((i * 137.31 + 47) % (height + 220)) - 220;
    const duration = isMobile ? 2.9 + ((i * 17) % 22) / 10 : 2.6 + ((i * 23) % 28) / 10;
    const delay = -(((i * 41) % 57) / 10);
    const drift = isMobile ? 3 + ((i * 11) % 8) : 5 + ((i * 13) % 14);
    const length = isMobile ? 34 + ((i * 19) % 25) : 42 + ((i * 29) % 34);
    const opacity = isMobile ? 0.16 + ((i * 7) % 18) / 100 : 0.18 + ((i * 11) % 25) / 100;

    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    drop.style.height = `${length}px`;
    drop.style.opacity = `${opacity}`;
    drop.style.setProperty("--waresh-hero-rain-drift", `${drift}px`);
    drop.style.setProperty("--waresh-hero-rain-duration", `${duration}s`);
    drop.style.setProperty("--waresh-hero-rain-delay", `${delay}s`);
    drop.style.animation = "waresh-hero-rain-fall var(--waresh-hero-rain-duration) linear var(--waresh-hero-rain-delay) infinite";

    rain.appendChild(drop);
    drops.push(drop);
  }

  let resizeTimer: number | undefined;

  const refresh = () => {
    const nextWidth = Math.max(rain.clientWidth, window.innerWidth, 320);
    drops.forEach((drop, index) => {
      const x = ((index * 83.17 + 31) % (nextWidth + 180)) - 90;
      drop.style.left = `${x}px`;
    });
  };

  const onResize = () => {
    if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 120);
  };

  window.addEventListener("resize", onResize, { passive: true });

  return () => {
    if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    drops.forEach((drop) => drop.remove());
    rain.classList.remove("waresh-rain-runtime");
    rain.classList.add("waresh-rain");
  };
}

type Cleanup = () => void;

export default function ScrollExperience({ children }: ScrollExperienceProps) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>("#top");
    const heroContainer = hero?.querySelector<HTMLElement>(".waresh-container");
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".waresh-reveal"));
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-waresh-parallax]"));

    if (hero) hero.style.minHeight = "620px";
    if (heroContainer) {
      heroContainer.style.minHeight = "620px";
      heroContainer.style.paddingBlock = "56px";
    }

    const previousSnapType = root.style.scrollSnapType;
    const previousSnapPadding = root.style.scrollPaddingTop;
    root.style.scrollSnapType = "none";
    root.style.scrollPaddingTop = "76px";

    const animatedReveals = reveals.filter((element) => !hero?.contains(element));
    const animatedParallaxItems = parallaxItems.filter((element) => !hero?.contains(element));

    const heroCleanups: Cleanup[] = [];
    if (hero) {
      heroCleanups.push(setupHeroSlogan(hero, reduceMotion));
      heroCleanups.push(setupHeroRain(hero));
    }

    if (reduceMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      return () => {
        heroCleanups.forEach((cleanup) => cleanup());
        root.style.scrollSnapType = previousSnapType;
        root.style.scrollPaddingTop = previousSnapPadding;
      };
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "-8% 0px -8% 0px", threshold: 0.12 });

    animatedReveals.forEach((element) => revealObserver.observe(element));

    const updateScroll = () => {
      const viewportCenter = window.innerHeight * 0.5;

      animatedParallaxItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
        const center = rect.top + rect.height * 0.5;
        const progress = (center - viewportCenter) / Math.max(window.innerHeight, 1);
        const strength = Number(element.dataset.wareshParallax ?? 14);
        const translate = Math.max(-strength, Math.min(strength, progress * strength));
        element.style.setProperty("--waresh-parallax-y", `${translate.toFixed(2)}px`);
      });
    };

    let frameId = 0;
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateScroll();
      });
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      heroCleanups.forEach((cleanup) => cleanup());
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
      root.style.scrollSnapType = previousSnapType;
      root.style.scrollPaddingTop = previousSnapPadding;
      if (hero) hero.style.removeProperty("min-height");
      if (heroContainer) {
        heroContainer.style.removeProperty("min-height");
        heroContainer.style.removeProperty("padding-block");
      }
    };
  }, []);

  return <div className="waresh-scroll-experience">{children}</div>;
}
