import { useState, useEffect, useRef } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollTrigger(options: UseScrollTriggerOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -100px 0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasTriggered, options.threshold, options.rootMargin]);

  return { elementRef, isIntersecting, hasTriggered };
}
