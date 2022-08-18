import { RefObject, useEffect, useRef, useState } from 'react';

export interface IntersectionObserverOptionsType extends IntersectionObserverInit {
  keepTracking?: boolean;
  delay?: number;
}

const useIntersectionObserver = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverOptionsType = {
    root: null,
    rootMargin: '0%',
    threshold: 0,
    keepTracking: false,
  }
) => {
  const observerRef = useRef<IntersectionObserver>();
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const { keepTracking, ...observerOptions } = options;

  useEffect(() => {
    if (typeof window.IntersectionObserver === 'undefined') {
      console.error('IntersectionObserver is not supported in this browser');
    } else {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((ent) => {
          if (ref.current && ref.current === ent.target && observerRef.current) {
            setEntry(ent);

            if (!keepTracking && ent.isIntersecting) {
              observerRef.current.unobserve(ref.current);
            }
          }
        });
      }, observerOptions);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (ref.current && observerRef.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (ref.current && observerRef.current) {
        observerRef.current.unobserve(ref.current);
      }
    };
  }, [ref.current, observerRef.current]);

  return {
    entry,
    isInViewport: Boolean(entry?.isIntersecting),
  };
};

export default useIntersectionObserver;
