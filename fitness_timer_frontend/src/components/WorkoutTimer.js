import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { countdown, clamp, formatSeconds } from '../utils/time';
import TVFocusable from './TVFocusable';
import TimerControls from './TimerControls';
import { normalizeTVKey, isActivationKey } from '../utils/tvKeyMap';
import { debugLog } from '../utils/debug';

/**
 * PUBLIC_INTERFACE
 * WorkoutTimer
 * A drift-safe countdown timer with TV remote controls, progress visualization (ring + bar),
 * and completion pulse animation.
 *
 * Props:
 * - seconds: number (initial duration)
 * - title?: string (label above timer)
 * - onComplete?: () => void
 * - className?: string
 */
export default function WorkoutTimer({ seconds = 60, title = 'Timer', onComplete, className = '' }) {
  const [duration, setDuration] = useState(Math.max(1, Math.floor(seconds)));
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const engineRef = useRef(null);
  const ringRef = useRef(null);
  const pulseRef = useRef(null);

  // Progress 0 to 1
  const progress = useMemo(() => {
    const safeDur = Math.max(1, duration);
    return clamp(1 - remaining / safeDur, 0, 1);
  }, [remaining, duration]);

  // Initialize or reset on seconds prop change
  useEffect(() => {
    setDuration(Math.max(1, Math.floor(seconds)));
    setRemaining(Math.max(1, Math.floor(seconds)));
    setRunning(false);
    setCompleted(false);
    stopEngine();
  }, [seconds]);

  const stopEngine = () => {
    if (engineRef.current) {
      try {
        engineRef.current.cancel();
      } catch {
        // noop
      }
      engineRef.current = null;
    }
  };

  const handleTick = useCallback((r) => {
    setRemaining(r);
  }, []);

  const handleComplete = useCallback(() => {
    setRunning(false);
    setCompleted(true);
    if (pulseRef.current) {
      // restart pulse animation by toggling class
      pulseRef.current.classList.remove('pulse');
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      pulseRef.current.offsetHeight;
      pulseRef.current.classList.add('pulse');
    }
    if (typeof onComplete === 'function') onComplete();
  }, [onComplete]);

  const start = useCallback(() => {
    if (running) return;
    setCompleted(false);
    setRunning(true);
    stopEngine();
    engineRef.current = countdown({
      durationSeconds: remaining,
      onTick: handleTick,
      onComplete: handleComplete,
      tickRateMs: 200,
    });
  }, [running, remaining, handleTick, handleComplete]);

  const pause = useCallback(() => {
    if (!running || !engineRef.current) return;
    engineRef.current.pause();
    setRunning(false);
  }, [running]);

  const resume = useCallback(() => {
    if (running || !engineRef.current) return;
    engineRef.current.resume();
    setRunning(true);
  }, [running]);

  const reset = useCallback(() => {
    setRunning(false);
    setCompleted(false);
    stopEngine();
    setRemaining(duration);
  }, [duration]);

  // Keyboard/remote bindings: Enter to toggle play/pause, Backspace to reset
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = normalizeTVKey(e);
      if (isActivationKey(k)) {
        e.preventDefault();
        e.stopPropagation();
        debugLog('Timer', 'toggle via activation');
        if (!running) {
          if (remaining <= 0) setRemaining(duration);
          start();
        } else {
          pause();
        }
        return;
      }
      if (k === 'Back') {
        e.preventDefault();
        e.stopPropagation();
        debugLog('Timer', 'reset via back');
        reset();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [running, remaining, duration, start, pause, reset]);

  // SVG Ring calculations
  const R = 100;
  const CIRC = 2 * Math.PI * R;
  const dash = useMemo(() => {
    const d = CIRC * progress;
    return clamp(d, 0, CIRC);
  }, [CIRC, progress]);

  // Inline styles consistent with Ocean theme
  const ringBg = 'rgba(255,255,255,0.25)';
  const ringFg = 'var(--color-secondary)';

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gap: 'var(--space-6)',
        justifyItems: 'center',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="h2" style={{ margin: 0 }}>
        {title}
      </div>

      {/* Progress ring with completion pulse */}
      <div
        ref={pulseRef}
        style={{
          position: 'relative',
          width: 240,
          height: 240,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          style={{ transform: 'rotate(-90deg)' }}
          ref={ringRef}
          aria-hidden="true"
        >
          <circle
            cx="110"
            cy="110"
            r={R}
            stroke={ringBg}
            strokeWidth="14"
            fill="none"
          />
          <circle
            cx="110"
            cy="110"
            r={R}
            stroke={ringFg}
            strokeWidth="14"
            fill="none"
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray var(--transition-med)',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.12))',
            }}
          />
        </svg>

        {/* Time label */}
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            transform: 'rotate(0deg)',
          }}
        >
          <div style={{ fontSize: 'calc(var(--font-size-3xl) + 10px)', fontWeight: 800 }}>
            {formatSeconds(remaining)}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', marginTop: 6 }}>
            {running ? 'Running' : completed ? 'Complete' : 'Ready'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 'min(640px, 80vw)',
          height: 14,
          borderRadius: 999,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.07), rgba(0,0,0,0.02))',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.08)',
        }}
        aria-label="Progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          style={{
            width: `${Math.round(progress * 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
            transition: 'width var(--transition-med)',
          }}
        />
      </div>

      {/* Controls */}
      <TimerControls
        isRunning={running}
        onPlay={() => {
          if (remaining <= 0) setRemaining(duration);
          if (!engineRef.current) {
            // engine starts with remaining seconds
            setTimeout(() => start(), 0);
          } else {
            resume();
          }
        }}
        onPause={pause}
        onReset={reset}
      />

      {/* Quick duration adjustments for demo (focusable chips) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-2)',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>Preset:</span>
        {[30, 45, 60, 90].map((s) => (
          <TVFocusable
            key={`preset-${s}`}
            id={`timer-preset-${s}`}
            as="button"
            className="btn btn-surface"
            onSelect={() => {
              stopEngine();
              setDuration(s);
              setRemaining(s);
              setRunning(false);
              setCompleted(false);
            }}
          >
            {s}s
          </TVFocusable>
        ))}
      </div>

      {/* Styles for pulse animation */}
      <style>{`
        .pulse::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 999px;
          background: radial-gradient(circle at center, rgba(245, 158, 11, 0.28), rgba(245, 158, 11, 0) 62%);
          animation: timer-pulse 980ms var(--ease-standard) 1;
          pointer-events: none;
        }
        @keyframes timer-pulse {
          0% { opacity: 0.0; transform: scale(0.9); }
          22% { opacity: 1; transform: scale(1.04); }
          100% { opacity: 0; transform: scale(1.16); }
        }
      `}</style>
    </div>
  );
}
