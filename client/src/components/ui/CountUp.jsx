import { useEffect, useRef, useState } from 'react';

export default function CountUp({ value, suffix = '', duration = 650, className }) {
  const countRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return undefined;
    }

    const startCounting = () => {
      const startTime = performance.now();
      let frameId;

      const updateCount = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easedProgress = 1 - ((1 - progress) ** 3);
        setCount(Math.round(value * easedProgress));

        if (progress < 1) {
          frameId = requestAnimationFrame(updateCount);
        }
      };

      frameId = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(frameId);
    };

    if (!('IntersectionObserver' in window)) {
      setCount(value);
      return undefined;
    }

    let cancelAnimation;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cancelAnimation = startCounting();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (cancelAnimation) cancelAnimation();
    };
  }, [value, duration]);

  return (
    <strong ref={countRef} className={className}>
      <span aria-hidden="true">{count}{suffix}</span>
      <span className="sr-only">{value}{suffix}</span>
    </strong>
  );
}
