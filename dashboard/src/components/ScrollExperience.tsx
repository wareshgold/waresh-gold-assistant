"use client";

import { useEffect, type ReactNode } from "react";

type ScrollExperienceProps = { children: ReactNode };

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

    if (reduceMotion) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      return () => {
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
