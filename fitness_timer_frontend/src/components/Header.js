import React from 'react';
import { Focusable } from './FocusManager';

/**
 * PUBLIC_INTERFACE
 * Header
 * TV-friendly header with brand and primary actions.
 * - Uses Ocean Professional theme tokens
 * - Focusable buttons for remote navigation
 */
export default function Header({ theme, onToggleTheme }) {
  return (
    <header
      className="px-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            boxShadow: 'var(--shadow-sm)',
          }}
        />
        <div>
          <div className="h2" style={{ margin: 0 }}>
            Fitness TV
          </div>
          <div
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
              marginTop: 2,
            }}
          >
            Timers • Workouts • Guides
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <Focusable id="header-start-btn" autoFocus>
          <button className="btn" aria-label="Start Quick Timer">
            ▶ Start
          </button>
        </Focusable>
        <Focusable id="header-browse-btn">
          <button className="btn btn-surface" aria-label="Browse Exercises">
            Browse
          </button>
        </Focusable>
        <Focusable id="header-theme-btn">
          <button
            className="btn btn-surface"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </Focusable>
      </div>
    </header>
  );
}
