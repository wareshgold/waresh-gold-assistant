"use client";

import { useEffect, type ReactNode } from "react";

type ScrollExperienceProps = {
  children: ReactNode;
};

export default function ScrollExperience({ children }: ScrollExperienceProps) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const hero = document.querySelector<HTMLElement>("#top");
    const heroContainer = hero?.querySelector<HTMLElement>(".waresh-container");
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".waresh-reveal"));
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".waresh-scroll-scene"));
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-waresh-parallax]"));

    if (hero) hero.style.minHeight = "620px";
    if (heroContainer) {
      heroContainer.style.minHeight = "620px";
      heroContainer.style.paddingBlock = "56px";
    }

    // Mobile intentionally uses native browser scrolling. The cinematic
    // sticky/snap experience is only enabled above 640px so touch scrolling
    // is never forced to snap between large sections.
    const cinematicIndexes = new Set([2, 3]);
    const cinematicScenes: Array<{ scene: HTMLElement; frame: HTMLElement }> = [];

    if (!isMobile) {
      scenes.forEach((scene, index) => {
        if (!cinematicIndexes.has(index)) return;

        const frame = scene.querySelector<HTMLElement>(":scope > .waresh-container");
        if (!frame) return;

        scene.classList.add("waresh-cinematic-scene");
        scene.style.scrollSnapAlign = "start";
        scene.style.scrollSnapStop = "always";
        frame.classList.add("waresh-sticky-frame");
        frame.style.transition =
          "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms ease";
        frame.style.transform = "scale(0.985)";
        frame.style.opacity = "0.94";

        cinematicScenes.push({ scene, frame });
      });
    }

    const previousSnapType = root.style.scrollSnapType;
    const previousSnapPadding = root.style.scrollPaddingTop;

    // Mandatory document-level snap is a desktop-only enhancement.
    if (!reduceMotion && !isMobile && cinematicScenes.length > 0) {
      root.style.scrollSnapType = "y mandatory";
      root.style.scrollPaddingTop = "76px";
    }

    const animatedReveals = reveals.filter((element) => !hero?.contains(element));
    const animatedParallaxItems = parallaxItems.filter((element) => !hero?.contains(element));

    if (reduceMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      return () => {
        cinematicScenes.forEach(({ scene, frame }) => {
          scene.classList.remove("waresh-cinematic-scene", "is-focused");
          scene.style.removeProperty("scroll-snap-align");
          scene.style.removeProperty("scroll-snap-stop");
          frame.classList.remove("waresh-sticky-frame");
          frame.style.removeProperty("transition");
          frame.style.removeProperty("transform");
          frame.style.removeProperty("opacity");
        });
        root.style.scrollSnapType = previousSnapType;
        root.style.scrollPaddingTop = previousSnapPadding;
        if (hero) hero.style.removeProperty("min-height");
        if (heroContainer) {
          heroContainer.style.removeProperty("min-height");
          heroContainer.style.removeProperty("padding-block");
        }
      };
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.12 },
    );

    animatedReveals.forEach((element) => revealObserver.observe(element));

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scene = entry.target as HTMLElement;
          const item = cinematicScenes.find(({ scene: candidate }) => candidate === scene);
          if (!item) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            scene.classList.add("is-focused");
            item.frame.style.transform = "scale(1)";
            item.frame.style.opacity = "1";
          } else {
            scene.classList.remove("is-focused");
            item.frame.style.transform = "scale(0.985)";
            item.frame.style.opacity = "0.94";
          }
        });
      },
      { threshold: [0.2, 0.45, 0.7] },
    );

    cinematicScenes.forEach(({ scene }) => sceneObserver.observe(scene));

    const updateScroll = () => {
      const viewportCenter = window.innerHeight * 0.5;

      scenes.forEach((scene) => {
        if (scene === hero) return;

        const rect = scene.getBoundingClientRect();
        const distance =
          (rect.top + rect.height * 0.5 - viewportCenter) /
          Math.max(window.innerHeight, 1);
        const progress = Math.max(-1, Math.min(1, distance));
        scene.style.setProperty("--waresh-scene-progress", progress.toFixed(3));

        if (scene.classList.contains("waresh-cinematic-scene")) {
          const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
          const sceneProgress = Math.max(0, Math.min(1, -rect.top / travel));
          scene.style.setProperty("--waresh-cinematic-progress", sceneProgress.toFixed(3));
        }
      });

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
      revealObserver.disconnect();
      sceneObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);

      root.style.scrollSnapType = previousSnapType;
      root.style.scrollPaddingTop = previousSnapPadding;

      cinematicScenes.forEach(({ scene, frame }) => {
        scene.style.removeProperty("--waresh-cinematic-progress");
        scene.classList.remove("waresh-cinematic-scene", "is-focused");
        scene.style.removeProperty("scroll-snap-align");
        scene.style.removeProperty("scroll-snap-stop");
        frame.classList.remove("waresh-sticky-frame");
        frame.style.removeProperty("transition");
        frame.style.removeProperty("transform");
        frame.style.removeProperty("opacity");
      });

      if (hero) hero.style.removeProperty("min-height");
      if (heroContainer) {
        heroContainer.style.removeProperty("min-height");
        heroContainer.style.removeProperty("padding-block");
      }
    };
  }, []);

  return <div className="waresh-scroll-experience">{children}</div>;
}
