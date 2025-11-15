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
    if (!thumbnail) {
      // Fallback subtle gradient background when thumbnail is missing
      return {
        backgroundImage: 'linear-gradient(135deg, rgba(17,24,39,0.35), rgba(31,41,55,0.55))',
      };
    }
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
    // Support data URLs and local/public asset paths such as "/assets/..."
    if (typeof thumbnail === 'string') {
      // Render using a background image to get object-fit: cover-like behavior
      return {
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
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
        // When using image background, ensure crisp edges and proper cover fit
        imageRendering: 'auto',
        ...backgroundStyle,
        ...style,
      }}
    >
      {/* Image layer for explicit src paths, ensuring object-fit: cover inside rounded mask */}
      {typeof thumbnail === 'string' && thumbnail && !thumbnail.startsWith('gradient:') ? (
        <img
          src={thumbnail}
          alt=""
          aria-hidden="true"
          onError={(e) => {
            // hide broken image; allow gradient fallback to show
            e.currentTarget.style.display = 'none';
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}
      {/* Scrim overlay for readable text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'relative',
          padding: 'var(--space-6)',
          color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.35)',
          zIndex: 2,
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
