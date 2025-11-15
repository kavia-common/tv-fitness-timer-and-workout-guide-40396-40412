import React, { useMemo } from 'react';
import TVFocusable from './TVFocusable';

/**
 * PUBLIC_INTERFACE
 * ExerciseCard
 * A large TV-friendly exercise card with smooth focus animations and OK action callback.
 *
 * Props:
 * - id: string (required) - stable focus id for FocusManager
 * - name: string - exercise title
 * - subtitle?: string - secondary info (e.g., duration, difficulty)
 * - thumbnail?: string | null - optional data URL or gradient token for background
 * - onSelect?: () => void - invoked when user presses OK/Enter/Space
 * - style?: React.CSSProperties - optional inline styles
 * - className?: string - extra classes
 */
export default function ExerciseCard({
  id,
  name,
  subtitle,
  thumbnail,
  onSelect,
  style = {},
  className = '',
}) {
  // Map "gradient:*" tokens to theme-based gradients
  const backgroundStyle = useMemo(() => {
    if (!thumbnail) return {};
    if (typeof thumbnail === 'string' && thumbnail.startsWith('gradient:')) {
      const key = thumbnail.split(':')[1];
      switch (key) {
        case 'ocean':
          return { backgroundImage: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' };
        case 'amberWave':
          return { backgroundImage: 'linear-gradient(135deg, #F59E0B, #FDE68A)' };
        case 'deepBlue':
          return { backgroundImage: 'linear-gradient(135deg, #1E3A8A, #2563EB)' };
        case 'tealMint':
          return { backgroundImage: 'linear-gradient(135deg, #14B8A6, #34D399)' };
        default:
          return {};
      }
    }
    if (typeof thumbnail === 'string' && thumbnail.startsWith('data:image')) {
      return { backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return {};
  }, [thumbnail]);

  return (
    <TVFocusable
      id={id}
      role="button"
      tabIndex={0}
      ariaLabel={`${name}${subtitle ? `, ${subtitle}` : ''}`}
      className={`exercise-card tv-card ${className}`.trim()}
      onSelect={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        minHeight: 260,
        // Focus/pressed animation: subtle scale + elevate shadow, transform-only to avoid layout shift
        transition: 'transform var(--transition-med), box-shadow var(--transition-med), border-color var(--transition-med), background var(--transition-med), filter var(--transition-med)',
        backgroundColor: 'var(--color-surface)',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        ...backgroundStyle,
        ...style,
      }}
    >
      {/* Image mask/gradient overlay for readable text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          padding: 'var(--space-6)',
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.35)',
        }}
      >
        <div
          className="h3"
          style={{
            margin: 0,
            fontSize: 'var(--font-size-2xl)',
            lineHeight: 1.22,
            fontWeight: 800,
            letterSpacing: 0.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </div>
        {subtitle ? (
          <div style={{ marginTop: 'var(--space-2)', opacity: 0.95, fontSize: 'var(--font-size-md)' }}>
            {subtitle}
          </div>
        ) : null}
      </div>
      {/* Badge hook (top-right) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          padding: '6px 10px',
          borderRadius: '999px',
          background: 'rgba(0,0,0,0.25)',
          color: '#fff',
          fontSize: 'var(--font-size-xs)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          display: 'none', /* show when needed */
        }}
      >
        Badge
      </div>
    </TVFocusable>
  );
}
