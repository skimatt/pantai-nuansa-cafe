'use client';

import { useEffect, type RefObject } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

let homepageScroll: Lenis | null = null;

export function scrollHomepageTo(target: HTMLElement | number) {
  if (homepageScroll) {
    homepageScroll.scrollTo(target, { immediate: true, force: true });
  } else {
    const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: 'instant' });
  }
}

type ScrollSettings = { enabled: boolean; lerp: number; wheelMultiplier: number };

export function useHomepageScroll(root: RefObject<HTMLElement | null>, settings: ScrollSettings) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let controller: Lenis | null = null;
    const tick = () => controller?.raf(performance.now());
    const update = () => ScrollTrigger.update();
    const sync = () => {
      if (document.hidden || document.body.style.overflow === 'hidden' || document.querySelector('dialog[open]')) {
        controller?.stop();
      } else {
        controller?.start();
      }
    };
    const toggle = (event: Event) => {
      if (event.target instanceof HTMLDialogElement) sync();
    };
    const configure = () => {
      gsap.ticker.remove(tick);
      controller?.destroy();
      controller = null;
      homepageScroll = null;
      element.setAttribute('data-scroll', 'native');
      if (reduced.matches || !settings.enabled) return;
      controller = new Lenis({
        autoRaf: false,
        lerp: settings.lerp,
        wheelMultiplier: settings.wheelMultiplier,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
        stopInertiaOnNavigate: true,
        prevent: node => node.matches('dialog, video, textarea, select, [data-lenis-prevent]'),
      });
      homepageScroll = controller;
      controller.on('scroll', update);
      gsap.ticker.add(tick);
      element.setAttribute('data-scroll', 'smooth');
      sync();
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    reduced.addEventListener('change', configure);
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('toggle', toggle, true);
    configure();
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', configure);
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('toggle', toggle, true);
      gsap.ticker.remove(tick);
      controller?.destroy();
      homepageScroll = null;
      element.removeAttribute('data-scroll');
    };
  }, [root, settings]);
}
