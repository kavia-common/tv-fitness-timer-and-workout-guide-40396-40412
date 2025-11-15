import React from 'react';
import TVFocusable from './TVFocusable';

// Helper component to render an SVG icon with a safe text fallback
function Icon({ src, label, fallback, size = 22 }) {
  // Use img tag to load local SVG; if it fails, show fallback text
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <img
        src={src}
        alt={label}
        aria-hidden="true"
        width={size}
        height={size}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          // Insert fallback text element next to the image if it fails
          const span = document.createElement('span');
          span.textContent = fallback;
          span.style.fontSize = '1.05em';
          span.style.lineHeight = '1';
          e.currentTarget.parentElement.appendChild(span);
        }}
        style={{ display: 'block', filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.25))' }}
      />
    </span>
  );
}

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
  const playIcon = process.env.PUBLIC_URL
    ? `${process.env.PUBLIC_URL}/static/media/play.svg`
    : undefined;

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
        <Icon
          src={require('../assets/icons/' + (isRunning ? 'pause' : 'play') + '.svg')}
          label={isRunning ? 'Pause' : 'Start'}
          fallback={isRunning ? '⏸' : '▶'}
          size={22}
        />
        <span>{isRunning ? 'Pause' : 'Start'}</span>
      </TVFocusable>

      <TVFocusable
        id="timer-btn-reset"
        as="button"
        className="btn btn-surface"
        aria-label="Reset timer"
        onSelect={onReset}
      >
        <Icon
          src={require('../assets/icons/reset.svg')}
          label="Reset"
          fallback="⟲"
          size={22}
        />
        <span>Reset</span>
      </TVFocusable>
    </div>
  );
}
