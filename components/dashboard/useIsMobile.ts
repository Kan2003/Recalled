// components/dashboard/useIsMobile.ts
// Viewport media-query hooks. Server render assumes desktop (no match).

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when the viewport is phone-sized. */
export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)");
}
