"use client";

// components/landing/hooks.ts
// Animation hooks for the hero demos. All client-side — these files must
// be imported from "use client" components only.

import { useEffect, useState } from "react";

/** Types out a string char-by-char with slight jitter for organic feel. */
export function useTypewriter(
  text: string,
  { speed = 22, startDelay = 0, run = true }: { speed?: number; startDelay?: number; run?: boolean } = {}
): [string, boolean] {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!run) return;
    setOut("");
    setDone(false);
    let i = 0;
    let id: ReturnType<typeof setTimeout>;
    const start = setTimeout(function tick() {
      if (i >= text.length) {
        setDone(true);
        return;
      }
      setOut(text.slice(0, ++i));
      id = setTimeout(tick, speed + Math.random() * speed * 0.5);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(id);
    };
  }, [text, speed, startDelay, run]);

  return [out, done];
}

/** Reveals array items one at a time on an interval. Loops by default. */
export function useStream<T>(
  items: T[],
  { delay = 900, startDelay = 400, loop = true }: { delay?: number; startDelay?: number; loop?: boolean } = {}
): T[] {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const start = setTimeout(function tick() {
      setCount((c) => {
        if (c >= items.length) {
          if (loop) {
            id = setTimeout(() => setCount(1), delay * 2);
            return c;
          }
          return c;
        }
        id = setTimeout(tick, delay);
        return c + 1;
      });
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(id);
    };
  }, [items.length, delay, startDelay, loop]);

  return items.slice(0, count);
}

export type AskStage = "q" | "thinking" | "a" | "hold";

/** Cycles through Q&A pairs: type Q, thinking dots, type A, hold, next pair. */
export function useAskAICycle(
  pairs: { q: string; a: string }[],
  { qSpeed = 24, aSpeed = 12, hold = 2400 }: { qSpeed?: number; aSpeed?: number; hold?: number } = {}
): { q: string; a: string; stage: AskStage; idx: number } {
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState<AskStage>("q");
  const pair = pairs[idx];

  const [q, qDone] = useTypewriter(pair.q, { speed: qSpeed, run: stage === "q" });
  const [a, aDone] = useTypewriter(pair.a, { speed: aSpeed, run: stage === "a" });

  useEffect(() => {
    if (stage === "q" && qDone) {
      const id = setTimeout(() => setStage("thinking"), 350);
      return () => clearTimeout(id);
    }
    if (stage === "thinking") {
      const id = setTimeout(() => setStage("a"), 900);
      return () => clearTimeout(id);
    }
    if (stage === "a" && aDone) {
      const id = setTimeout(() => setStage("hold"), hold);
      return () => clearTimeout(id);
    }
    if (stage === "hold") {
      const id = setTimeout(() => {
        setIdx((i) => (i + 1) % pairs.length);
        setStage("q");
      }, 200);
      return () => clearTimeout(id);
    }
  }, [stage, qDone, aDone, hold, pairs.length]);

  return { q, a, stage, idx };
}
