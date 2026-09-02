"use client";

import { useEffect, type ReactNode } from "react";

type ScrollExperienceProps = {
  children: ReactNode;
};

export default function ScrollExperience({ children }: ScrollExperienceProps) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>("#top");
    const heroContainer = hero?.querySelector<HTMLElement>(".waresh-container");
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".waresh-reveal"));
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".waresh-scroll-scene"));
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-waresh-parallax]"));

    // The opening view should feel like a clean storefront, not an animation demo.
    // Keep the hero compact and completely static; cinematic behavior starts later.
    if (hero) hero.style.minHeight = "620px";
    if (heroContainer) {
      heroContainer.style.minHeight = "620px";
      heroContainer.style.paddingBlock = "56px";
    }

    const cinematicIndexes = new Set([2, 3]);
    const cinematicScenes: HTMLElement[] = [];

    scenes.forEach((scene, index) => {
      if (!cinematicIndexes.has(index)) return;

      scene.classList.add("waresh-cinematic-scene");
      scene.style.scrollSnapAlign = "start";
      scene.style.scrollSnapStop = "always";

      const frame = scene.firstElementChild;
      if (frame instanceof HTMLElement) {
        frame.classList.add("waresh-sticky-frame");
        frame.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease";
        frame.style.transform = "scale(0.985)";
        frame.style.opacity = "0.94";
      }

      cinematicScenes.push(scene);
    });

    // Native scroll-snap gives the cinematic scenes an actual landing point.
    // It is intentionally proximity-based so the rest of the storefront still feels natural.
    const previousSnapType = root.style.scrollSnapType;
    const previousSnapPadding = root.style.scrollPaddingTop;
    if (!reduceMotion) {
      root.style.scrollSnapType = "y proximity";
      root.style.scrollPaddingTop = "76px";
    }

    // Do not animate the opening scene. Later scenes can still use reveals/parallax.
    const animatedReveals = reveals.filter((element) => !hero?.contains(element));
    const animatedParallaxItems = parallaxItems.filter((element) => !hero?.contains(element));

    if (reduceMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      return () => {
        scenes.forEach((scene) => {
          scene.classList.remove("waresh-cinematic-scene");
          scene.style.removeProperty("scroll-snap-align");
          scene.style.removeProperty("scroll-snap-stop");
          const frame = scene.firstElementChild;
          if (frame instanceof HTMLElement) {
            frame.classList.remove("waresh-sticky-frame");
            frame.style.removeProperty("transition");
            frame.style.removeProperty("transform");
            frame.style.removeProperty("opacity");
          }
        });
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
          if (!scene.classList.contains("waresh-cinematic-scene")) return;

          const frame = scene.firstElementChild;
          if (!(frame instanceof HTMLElement)) return;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            scene.classList.add("is-focused");
            frame.style.transform = "scale(1)";
            frame.style.opacity = "1";
          } else {
            scene.classList.remove("is-focused");
            frame.style.transform = "scale(0.985)";
            frame.style.opacity = "0.94";
          }
        });
      },
      { threshold: [0.2, 0.45, 0.7] },
    );

    cinematicScenes.forEach((scene) => sceneObserver.observe(scene));

    const updateScroll = () => {
      const viewportCenter = window.innerHeight * 0.5;

      scenes.forEach((scene) => {
        if (scene === hero) return;

        const rect = scene.getBoundingClientRect();
        const distance = (rect.top + rect.height * 0.5 - viewportCenter) / Math.max(window.innerHeight, 1);
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

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
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
      if (frame) window.cancelAnimationFrame(frame);

      root.style.scrollSnapType = previousSnapType;
      root.style.scrollPaddingTop = previousSnapPadding;
      scenes.forEach((scene) => {
        scene.style.removeProperty("--waresh-cinematic-progress");
        scene.classList.remove("waresh-cinematic-scene", "is-focused");
        scene.style.removeProperty("scroll-snap-align");
        scene.style.removeProperty("scroll-snap-stop");
        const frameElement = scene.firstElementChild;
        if (frameElement instanceof HTMLElement) {
          frameElement.classList.remove("waresh-sticky-frame");
          frameElement.style.removeProperty("transition");
          frameElement.style.removeProperty("transform");
          frameElement.style.removeProperty("opacity");
        }
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
