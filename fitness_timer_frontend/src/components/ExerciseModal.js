import React, { useEffect, useRef, useState, useCallback } from 'react';
import TVFocusable from './TVFocusable';
import WorkoutTimer from './WorkoutTimer';
import { normalizeTVKey, isBackKey, isArrow } from '../utils/tvKeyMap';

/**
 * PUBLIC_INTERFACE
 * ExerciseModal
 * Full-screen overlay modal for TV that shows selected exercise details and embeds a WorkoutTimer
 * initialized with the exercise's default duration. Focus is trapped within the modal; Back closes
 * the modal and restores focus to the previously focused element in the caller.
 *
 * Props:
 * - exercise: { id, name, description, durationDefault, difficulty, equipment }
 * - onClose: () => void
 * - initialFocusId?: string - id to assign to the first focusable control in the modal
 */
export default function ExerciseModal({ exercise, onClose, initialFocusId = 'exercise-close' }) {
  const [seconds, setSeconds] = useState(Math.max(1, Math.floor(exercise?.durationDefault || 60)));
  const containerRef = useRef(null);
  const focusablesRef = useRef([]);

  // Collect focusable elements within modal for trapping
  const collectFocusable = useCallback(() => {
    if (!containerRef.current) return [];
    const nodes = containerRef.current.querySelectorAll('[data-focusable="true"], button, [tabindex]');
    focusablesRef.current = Array.from(nodes).filter((el) => {
      const ti = (el.getAttribute('tabindex') || '0') * 1;
      const disabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
      return !disabled && (ti >= 0 || el.tagName === 'BUTTON');
    });
    return focusablesRef.current;
  }, []);

  // Focus trap: ensure focus remains within modal
  useEffect(() => {
    // Defer to next frame to allow children mount
    const t = setTimeout(() => {
      const f = collectFocusable();
      // Try focusing a preferred element
      const target = containerRef.current.querySelector(`[data-focus-id="${initialFocusId}"]`) || f[0];
      if (target && typeof target.focus === 'function') target.focus();
    }, 0);

    return () => clearTimeout(t);
  }, [collectFocusable, initialFocusId]);

  // Key handler for trapping and Back to close
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = normalizeTVKey(e);
      if (isBackKey(k)) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof onClose === 'function') onClose();
        return;
      }

      // Trap focus navigation horizontally between the first row of focusables
      if (isArrow(k)) {
        const f = collectFocusable();
        if (!f.length) return;

        const active = document.activeElement;
        const idx = f.findIndex((el) => el === active);
        if (idx >= 0) {
          let nextIdx = idx;
          if (k === 'ArrowRight') nextIdx = Math.min(f.length - 1, idx + 1);
          if (k === 'ArrowLeft') nextIdx = Math.max(0, idx - 1);
          if (nextIdx !== idx) {
            e.preventDefault();
            e.stopPropagation();
            f[nextIdx].focus();
          }
        } else {
          e.preventDefault();
          e.stopPropagation();
          f[0].focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose, collectFocusable]);

  if (!exercise) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${exercise.name} details`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        // Modal backdrop with scrim and soft vignette
        background: 'linear-gradient(180deg, rgba(5,15,28,0.45), rgba(5,15,28,0.65))',
        color: '#fff',
        overflow: 'hidden',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Top bar: title and Close */}
      <div
        className="px-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        <div>
          <div className="h2" style={{ color: '#fff', margin: 0 }}>{exercise.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.86)', marginTop: 4, fontSize: 'var(--font-size-sm)' }}>
            {exercise.durationDefault}s • {exercise.difficulty} {exercise.equipment ? `• ${exercise.equipment}` : ''}
          </div>
        </div>

        <TVFocusable
          id="exercise-close"
          as="button"
          tabIndex={0}
          role="button"
          className="btn btn-secondary"
          aria-label="Close"
          onSelect={onClose}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={require('../assets/icons/arrow.svg')}
                alt="Back"
                aria-hidden="true"
                width={20}
                height={20}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const span = document.createElement('span');
                  span.textContent = '⬅';
                  span.style.fontSize = '1.0em';
                  e.currentTarget.parentElement.appendChild(span);
                }}
              />
            </span>
            <span>Back</span>
          </span>
        </TVFocusable>
      </div>

      {/* Content */}
      <div
        className="px-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 1fr',
          gap: 'var(--space-8)',
          alignItems: 'start',
          paddingBottom: 'var(--space-10)',
          overflow: 'auto',
        }}
      >
        {/* Left: Details */}
        <div className="tv-card" style={{ padding: 'var(--space-6)', background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)' }}>
          <div className="h3" style={{ color: '#fff', marginTop: 0, marginBottom: 'var(--space-4)' }}>About</div>
          <div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
            {exercise.description}
          </div>

          {/* Presets as focusable chips for quick duration set */}
          <div style={{ marginTop: 'var(--space-6)', color: 'rgba(255,255,255,0.92)' }}>
            <div style={{ marginBottom: 'var(--space-3)' }}>Quick presets:</div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {[30, 45, 60, 90].map((s) => (
                <TVFocusable
                  key={`modal-preset-${s}`}
                  id={`modal-preset-${s}`}
                  as="button"
                  className="btn btn-surface"
                  onSelect={() => setSeconds(s)}
                >
                  {s}s
                </TVFocusable>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Timer */}
        <div className="tv-card" style={{ padding: 'var(--space-6)', background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.18)' }}>
          <WorkoutTimer seconds={seconds} title={`${exercise.name} Timer`} />
        </div>
      </div>

      {/* Local styles for modal visual polish */}
      <style>{`
        .btn.btn-surface {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .btn.btn-surface:hover {
          background: rgba(255,255,255,0.12);
        }
      `}</style>
    </div>
  );
}
