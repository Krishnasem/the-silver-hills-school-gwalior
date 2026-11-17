import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  id?: string;
}

/**
 * AnimatedText component that smoothly brings text into place on initial page load,
 * and re-animates smoothly as visitors scroll. Uses standard React + CSS hardware acceleration
 * ensuring zero external animation library conflicts.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  direction = 'up',
  distance = 24,
  tag = 'div',
  id,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: 'opacity, transform',
  };

  const Component = tag as any;

  return (
    <Component ref={ref} id={id} className={className} style={style}>
      {children}
    </Component>
  );
};

/**
 * AnimatedSectionHeader handles standard section titles with staggered entrance
 * (Eyebrow Badge -> Big Title -> Subtitle / Description).
 */
export interface AnimatedSectionHeaderProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  badgeClassName?: string;
  id?: string;
}

export const AnimatedSectionHeader: React.FC<AnimatedSectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  badgeClassName = '',
  id,
}) => {
  const alignmentClass =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : align === 'right'
      ? 'text-right items-end ml-auto'
      : 'text-left items-start';

  return (
    <div id={id} className={`flex flex-col space-y-3 max-w-3xl ${alignmentClass} ${className}`}>
      {badge && (
        <AnimatedText delay={0.05} distance={18} direction="up" className="w-fit">
          {typeof badge === 'string' ? (
            <div
              className={`inline-flex items-center px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide ${badgeClassName}`}
            >
              {badge}
            </div>
          ) : (
            badge
          )}
        </AnimatedText>
      )}

      <AnimatedText
        tag="h2"
        delay={0.15}
        distance={24}
        direction="up"
        className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111638] spotlight-text-dark ${titleClassName}`}
      >
        {title}
      </AnimatedText>

      {subtitle && (
        <AnimatedText
          tag="p"
          delay={0.25}
          distance={20}
          direction="up"
          className={`text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl ${subtitleClassName}`}
        >
          {subtitle}
        </AnimatedText>
      )}
    </div>
  );
};
