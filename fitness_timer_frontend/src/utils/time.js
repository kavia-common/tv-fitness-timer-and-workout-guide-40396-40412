//
// PUBLIC_INTERFACE
// time.js
// Time utilities for drift-safe countdowns and formatting tailored for TV timers.

/**
 * PUBLIC_INTERFACE
 * clamp
 * Clamps a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * PUBLIC_INTERFACE
 * formatSeconds
 * Formats seconds into M:SS string (e.g., 65 -> "1:05").
 */
export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Drift-safe setInterval: schedules next tick based on a fixed start time to minimize drift.
 * Returns a cancel function.
 */
export function startDriftSafeInterval(callback, intervalMs) {
  let active = true;
  const start = performance.now();
  let count = 0;

  function tick() {
    if (!active) return;
    const target = start + ++count * intervalMs;
    const now = performance.now();
    const drift = now - target;
    // Execute callback, pass count and drift info
    callback({ count, drift, now, target });

    const nextDelay = Math.max(0, intervalMs - drift);
    // Use setTimeout instead of setInterval for better alignment
    setTimeout(tick, nextDelay);
  }

  const firstDelay = intervalMs;
  const timerId = setTimeout(tick, firstDelay);

  return () => {
    active = false;
    clearTimeout(timerId);
  };
}

/**
 * PUBLIC_INTERFACE
 * countdown
 * Drift-safe countdown engine in seconds.
 * Options:
 * - durationSeconds: number
 * - onTick: (remainingSeconds) => void
 * - onComplete: () => void
 * - tickRateMs: default 250 (UI smoothness), but computes seconds based on high-res clock
 *
 * Returns control: { pause, resume, cancel, getState }
 */
export function countdown({ durationSeconds, onTick, onComplete, tickRateMs = 250 }) {
  const startTime = performance.now();
  const endTime = startTime + durationSeconds * 1000;
  let paused = false;
  let pauseStartedAt = 0;
  let accumulatedPause = 0;
  let cancelInterval = null;
  let completed = false;

  const computeRemaining = () => {
    const now = performance.now();
    const effectiveNow = paused ? pauseStartedAt : now;
    const remainMs = Math.max(0, endTime + accumulatedPause - effectiveNow);
    return Math.ceil(remainMs / 1000);
  };

  const tick = () => {
    if (completed) return;
    const remaining = computeRemaining();
    if (typeof onTick === 'function') onTick(remaining);
    if (remaining <= 0 && !completed) {
      completed = true;
      if (cancelInterval) cancelInterval();
      if (typeof onComplete === 'function') onComplete();
    }
  };

  const loop = () => {
    if (cancelInterval) cancelInterval();
    cancelInterval = startDriftSafeInterval(() => {
      if (!paused) tick();
    }, tickRateMs);
  };

  loop();
  // Prime immediate tick for UI
  tick();

  const pause = () => {
    if (paused || completed) return;
    paused = true;
    pauseStartedAt = performance.now();
  };

  const resume = () => {
    if (!paused || completed) return;
    const now = performance.now();
    accumulatedPause += now - pauseStartedAt;
    paused = false;
  };

  const cancel = () => {
    if (cancelInterval) cancelInterval();
  };

  const getState = () => ({
    paused,
    completed,
    remaining: computeRemaining(),
    total: durationSeconds,
  });

  return { pause, resume, cancel, getState };
}
