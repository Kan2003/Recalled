"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let instance: { destroy: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { default: LocomotiveScroll } = await import("locomotive-scroll");
      if (cancelled) return;
      instance = new LocomotiveScroll();
    })();

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  return null;
}
