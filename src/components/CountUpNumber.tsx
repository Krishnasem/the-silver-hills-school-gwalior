import React, { useEffect, useState, useRef } from 'react';

export interface CountUpNumberProps {
  /** The starting number for the counter. Defaults to 1 */
  start?: number;
  /** The target number to count up to */
  end: number;
  /** Duration of the counting animation in milliseconds */
  duration?: number;
  /** Optional delay before counting starts (in ms) */
  delay?: number;
  /** String to append to the number (e.g. "+" or " +") */
  suffix?: string;
  /** String to prepend to the number */
  prefix?: string;
  /** Whether to format with thousand commas (e.g. 2,500) */
  formatWithCommas?: boolean;
  className?: string;
  id?: string;
}

/**
 * Counts up from `start` (1 by default) to `end` whenever the element scrolls
 * or appears in the viewport.
 */
export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  start = 1,
  end,
  duration = 2000,
  delay = 0,
  suffix = '',
  prefix = '',
  formatWithCommas = false,
  className = '',
  id,
}) => {
  const [count, setCount] = useState<number>(start);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let startTime: number | null = null;

    const runCountAnimation = () => {
      startTime = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic: fast start from 1, smooth deceleration into final number
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(start + (end - start) * ease);

        setCount(progress >= 1 ? end : currentVal);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        }
      };

      setCount(start);

      if (delay > 0) {
        timeoutId = setTimeout(() => {
          rafId = requestAnimationFrame(step);
        }, delay);
      } else {
        rafId = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountAnimation();
          } else {
            // Reset to starting value (1) when out of view so it recounts on return
            if (rafId) cancelAnimationFrame(rafId);
            if (timeoutId) clearTimeout(timeoutId);
            setCount(start);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [start, end, duration, delay]);

  const formattedNumber = formatWithCommas ? count.toLocaleString('en-US') : count;

  return (
    <span ref={containerRef} id={id} className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
