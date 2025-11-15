import React from 'react';
import TVFocusable from './TVFocusable';

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
        <TVFocusable id="header-start-btn" autoFocus as="button" className="btn" aria-label="Start Quick Timer" onSelect={() => { /* hook up to timer start when implemented */ }}>
          ▶ Start
        </TVFocusable>

        <TVFocusable id="header-browse-btn" as="button" className="btn btn-surface" aria-label="Browse Exercises" onSelect={() => { /* hook up to navigation when implemented */ }}>
          Browse
        </TVFocusable>

        <TVFocusable
          id="header-theme-btn"
          as="button"
          className="btn btn-surface"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onSelect={onToggleTheme}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </TVFocusable>
      </div>
    </header>
  );
}
