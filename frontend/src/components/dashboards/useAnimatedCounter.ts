'use client';

import { useEffect, useRef, useState } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  startOnView?: boolean;
}

export function useAnimatedCounter(
  end: number,
  { duration = 1500, startOnView = true }: UseAnimatedCounterOptions = {}
) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startOnView) {
      animate();
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          animate();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration, startOnView]);

  function animate() {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    };
    requestAnimationFrame(tick);
  }

  return { value, ref };
}
