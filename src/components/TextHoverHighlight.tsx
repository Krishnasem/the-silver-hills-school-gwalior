import React, { useEffect, useState, useRef } from 'react';

export function TextHoverHighlight() {
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [circleSize, setCircleSize] = useState(120);
  const rafRef = useRef<number | null>(null);
  const targetPosRef = useRef({ x: -200, y: -200 });
  const currentPosRef = useRef({ x: -200, y: -200 });
  const currentRadiusRef = useRef(0);
  const targetRadiusRef = useRef(0);

  useEffect(() => {
    // Only enable on devices that have a pointer (mouse/trackpad)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const textTagNames = new Set([
      'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
      'SPAN', 'A', 'LI', 'LABEL', 'STRONG',
      'B', 'EM', 'I', 'U', 'SMALL', 'DT', 'DD',
      'BLOCKQUOTE', 'FIGCAPTION', 'TH', 'TD', 'CITE', 'TIME'
    ]);

    const checkIfTextElement = (el: HTMLElement | null): { isText: boolean; size: number } => {
      if (!el) return { isText: false, size: 120 };

      // Check if element or any of its ancestors is a button, input, or interactive CTA
      const buttonOrInput = el.closest(
        'button, [role="button"], input, textarea, select, [type="button"], [type="submit"], a.btn, a[class*="rounded-full"][class*="bg-"]'
      );
      if (buttonOrInput) {
        return { isText: false, size: 120 };
      }

      let current: HTMLElement | null = el;
      let depth = 0;

      while (current && depth < 6 && current !== document.body) {
        const tag = current.tagName.toUpperCase();

        if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'SVG' || tag === 'IMG') {
          return { isText: false, size: 120 };
        }

        const hasTextContent = current.textContent && current.textContent.trim().length > 0;
        const isDirectTextTag = textTagNames.has(tag);

        if (isDirectTextTag && hasTextContent) {
          let size = 120;
          if (['H1', 'H2'].includes(tag)) {
            size = 135;
          } else if (['H3', 'H4'].includes(tag)) {
            size = 125;
          } else if (['SMALL', 'TIME', 'LABEL'].includes(tag)) {
            size = 100;
          } else {
            size = 115;
          }

          return { isText: true, size };
        }

        current = current.parentElement;
        depth++;
      }

      return { isText: false, size: 120 };
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const { isText, size } = checkIfTextElement(target);

      setIsHoveringText(isText);
      if (isText) {
        setCircleSize(size);
        targetRadiusRef.current = size / 2;
      } else {
        targetRadiusRef.current = 0;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHoveringText(false);
      targetRadiusRef.current = 0;
      document.documentElement.style.setProperty('--spot-r', '0px');
    };

    // Smooth RAF loop for real-time CSS variables & cursor tracking
    const updatePosition = () => {
      const ease = 0.28;
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * ease;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * ease;

      const radiusEase = 0.25;
      currentRadiusRef.current += (targetRadiusRef.current - currentRadiusRef.current) * radiusEase;

      const curX = Math.round(currentPosRef.current.x * 10) / 10;
      const curY = Math.round(currentPosRef.current.y * 10) / 10;
      const curR = Math.round(currentRadiusRef.current * 10) / 10;

      setPosition({ x: curX, y: curY });

      // Update CSS variables for text spotlight
      document.documentElement.style.setProperty('--spot-x', `${curX}px`);
      document.documentElement.style.setProperty('--spot-y', `${curY}px`);
      document.documentElement.style.setProperty('--spot-r', `${curR}px`);

      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.documentElement.style.setProperty('--spot-r', '0px');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-30 transition-opacity duration-200"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: isVisible && isHoveringText ? 1 : 0,
        mixBlendMode: 'multiply',
      }}
    >
      {/* Flat Solid Green Circle with multiply blend mode ensuring text is 100% visible and high-contrast inside */}
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9AB819] transition-transform duration-200 ease-out select-none ${
          isHoveringText ? 'scale-100' : 'scale-0'
        }`}
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
        }}
      />
    </div>
  );
}
