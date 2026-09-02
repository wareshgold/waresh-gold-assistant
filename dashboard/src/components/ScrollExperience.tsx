"use client";

import { useEffect, type ReactNode } from "react";

type ScrollExperienceProps = {
  children: ReactNode;
};

export default function ScrollExperience({ children }: ScrollExperienceProps) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".waresh-reveal"));
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(".waresh-scroll-scene"));
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-waresh-parallax]"));

    if (reduceMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      return;
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

    reveals.forEach((element) => revealObserver.observe(element));

    const updateScroll = () => {
      const viewportCenter = window.innerHeight * 0.5;

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const distance = (rect.top + rect.height * 0.5 - viewportCenter) / Math.max(window.innerHeight, 1);
        const progress = Math.max(-1, Math.min(1, distance));
        scene.style.setProperty("--waresh-scene-progress", progress.toFixed(3));
      });

      parallaxItems.forEach((element) => {
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.removeProperty("--waresh-scroll-progress");
    };
  }, []);

  return <div className="waresh-scroll-experience">{children}</div>;
}
