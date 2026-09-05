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

function setupHeroRain(hero: HTMLElement, reduceMotion: boolean): () => void {
  const rain = hero.querySelector<HTMLElement>(".waresh-rain");
  if (!rain) return () => undefined;

  // The old `.waresh-rain` selector also owns a legacy CSS pseudo-rain layer.
  // Remove that class before creating the runtime rain so there can only be
  // one rain system on the hero. This prevents the old diagonal/faster patch
  // from rendering underneath the new uniform rain animation.
  rain.classList.remove("waresh-rain");
  rain.classList.add("waresh-rain-runtime");

  rain.querySelectorAll(".waresh-rain-drop").forEach((drop) => drop.remove());

  const drops: Array<{
    element: HTMLSpanElement;
    x: number;
    y: number;
    speed: number;
    drift: number;
    length: number;
    opacity: number;
  }> = [];

  const count = window.innerWidth <= 640 ? 34 : 58;
  const width = Math.max(hero.clientWidth, window.innerWidth, 320);
  const height = Math.max(hero.clientHeight, window.innerHeight, 620);

  for (let i = 0; i < count; i += 1) {
    const element = document.createElement("span");
    element.className = "waresh-rain-drop";

    const drop = {
      element,
      x: ((i * 137.7) % (width + 160)) - 80,
      y: ((i * 83.4) % (height + 240)) - 240,
      speed: 260 + ((i * 47) % 180),
      drift: 26 + ((i * 13) % 32),
      length: 42 + ((i * 19) % 34),
      opacity: 0.22 + ((i * 7) % 28) / 100,
    };

    element.style.height = `${drop.length}px`;
    element.style.opacity = `${drop.opacity}`;
    element.style.animation = "none";
    rain.appendChild(element);
    drops.push(drop);
  }

  if (reduceMotion) {
    drops.forEach((drop) => {
      drop.element.style.transform = `translate3d(${drop.x}px, ${drop.y + 220}px, 0) rotate(9deg)`;
    });
    return () => {
      drops.forEach((drop) => drop.element.remove());
      rain.classList.remove("waresh-rain-runtime");
      rain.classList.add("waresh-rain");
    };
  }

  let frameId = 0;
  let previousTime = performance.now();
  let active = true;

  const animate = (time: number) => {
    if (!active) return;

    const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;

    drops.forEach((drop) => {
      drop.y += drop.speed * deltaSeconds;
      drop.x += drop.drift * deltaSeconds;

      if (drop.y > height + 180 || drop.x > width + 120) {
        drop.y = -drop.length - 80;
        drop.x = ((drop.x * 0.37 + 97) % (width + 160)) - 80;
      }

      drop.element.style.transform = `translate3d(${drop.x}px, ${drop.y}px, 0) rotate(9deg)`;
    });

    frameId = window.requestAnimationFrame(animate);
  };

  frameId = window.requestAnimationFrame(animate);

  return () => {
    active = false;
    window.cancelAnimationFrame(frameId);
    drops.forEach((drop) => drop.element.remove());
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
      heroCleanups.push(setupHeroRain(hero, reduceMotion));
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
