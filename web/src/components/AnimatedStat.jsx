import React, { useState, useEffect } from 'react';

// Smooth numerical transition hook
function useAnimatedNumber(targetValue, duration = 400) {
  const [current, setCurrent] = useState(targetValue);

  useEffect(() => {
    if (typeof targetValue !== 'number' || isNaN(targetValue)) {
      setCurrent(targetValue);
      return;
    }

    const start = current || 0;
    const diff = targetValue - start;
    if (diff === 0) return;

    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const eased = progress * (2 - progress);
      const nextVal = start + diff * eased;
      setCurrent(Math.round(nextVal * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(targetValue);
      }
    }

    const req = requestAnimationFrame(step);
    return () => cancelAnimationFrame(req);
  }, [targetValue, duration]);

  return current;
}

export default function AnimatedStat({ value, suffix = "", prefix = "" }) {
  const animated = useAnimatedNumber(typeof value === 'number' ? value : 0);
  if (value == null) return <span>-</span>;
  return (
    <span className="animated-number">
      {prefix}{typeof value === 'number' ? animated.toLocaleString() : value}{suffix}
    </span>
  );
}
