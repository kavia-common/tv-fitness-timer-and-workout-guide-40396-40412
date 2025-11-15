import React from 'react';
import TVFocusable from './TVFocusable';

/**
 * PUBLIC_INTERFACE
 * TimerControls
 * TV-friendly control cluster for timers with Play/Pause/Reset.
 *
 * Props:
 * - isRunning: boolean
 * - onPlay: () => void
 * - onPause: () => void
 * - onReset: () => void
 * - className?: string
 */
export default function TimerControls({
  isRunning,
  onPlay,
  onPause,
  onReset,
  className = '',
}) {
  return (
    <div
      role="group"
      aria-label="Timer controls"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <TVFocusable
        id="timer-btn-playpause"
        as="button"
        className="btn"
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        onSelect={isRunning ? onPause : onPlay}
      >
        {isRunning ? '⏸ Pause' : '▶ Start'}
      </TVFocusable>

      <TVFocusable
        id="timer-btn-reset"
        as="button"
        className="btn btn-surface"
        aria-label="Reset timer"
        onSelect={onReset}
      >
        ⟲ Reset
      </TVFocusable>
    </div>
  );
}
