import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import useTVFocusRing from '../hooks/useTVFocusRing';
import { normalizeTVKey, isActivationKey } from '../utils/tvKeyMap';
import { useFocusManager } from './FocusManager';
import { debugLog } from '../utils/debug';

/**
 * PUBLIC_INTERFACE
 * TVFocusable
 * A utility wrapper that standardizes TV focus behavior across the app.
 *
 * Features:
 * - Adds data-focusable attribute for discoverability.
 * - Integrates with FocusManager registry using a stable id (if provided).
 * - Manages focus ring class via useTVFocusRing and native focus/blur events.
 * - Handles Enter/OK/Space to invoke onSelect callback.
 * - Safely merges refs between parent forwardRef, focus ring hook, and child element.
 * - Sets role/tabIndex for accessibility and D-pad focusability.
 * - Also wires mouse/touch click to onSelect for desktop users.
 *
 * Props:
 * - id?: string            - identifier used by FocusManager for programmatic focus
 * - as?: string|component  - element/component type to render (default 'div')
 * - role?: string          - aria role (default 'button')
 * - tabIndex?: number      - focus order (default 0)
 * - className?: string
 * - autoFocus?: boolean    - request initial focus on mount (default false)
 * - onSelect?: (event) => void - invoked on Enter/OK/Space/Click
 * - onKeyDown?: (event) => void - additional keydown handler
 * - onFocus?: (event) => void
 * - onBlur?: (event) => void
 * - ariaLabel?: string     - optional aria-label for screen readers
 * - ...rest: any other props passed to the underlying element
 *
 * Usage:
 * <TVFocusable id="start-btn" onSelect={() => startTimer()}>
 *   Start
 * </TVFocusable>
 */
// PUBLIC_INTERFACE
const TVFocusable = forwardRef(function TVFocusable(
  {
    id,
    as: Component = 'div',
    role = 'button',
    tabIndex = 0,
    className = '',
    autoFocus = false,
    onSelect,
    onKeyDown,
    onFocus,
    onBlur,
    ariaLabel,
    children,
    ...rest
  },
  forwardedRef
) {
  const { ref: focusRingRef, focus: focusRingFocus } = useTVFocusRing();
  const localRef = useRef(null);
  const { register, setInitialFocus } = useFocusManager();

  // Merge multiple refs into one assignment target
  const setRefs = useCallback(
    (node) => {
      localRef.current = node;
      focusRingRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef && typeof forwardedRef === 'object') forwardedRef.current = node;
    },
    [forwardedRef, focusRingRef]
  );

  // Register with FocusManager when id is provided
  useEffect(() => {
    if (!id) return undefined;
    const unregister = register(id, { current: localRef.current }, { focusable: true });
    if (autoFocus) {
      // schedule after mount to ensure element is present
      requestAnimationFrame(() => setInitialFocus(id));
    }
    return unregister;
  }, [id, register, setInitialFocus, autoFocus]);

  // Auto-focus if requested even without FocusManager id
  useEffect(() => {
    if (autoFocus && !id) {
      requestAnimationFrame(() => {
        try {
          focusRingFocus();
        } catch {
          /* noop */
        }
        if (localRef.current && typeof localRef.current.focus === 'function') {
          localRef.current.focus();
        }
      });
    }
  }, [autoFocus, id, focusRingFocus]);

  const activate = useCallback(
    (e) => {
      if (typeof onSelect === 'function') {
        // Only prevent defaults for handled activation events
        try { e.preventDefault(); } catch { /* noop */ }
        try { e.stopPropagation(); } catch { /* noop */ }
        debugLog('TVFocusable', 'onSelect', { id, type: e?.type });
        onSelect(e);
      }
    },
    [onSelect, id]
  );

  const handleKeyDown = useCallback(
    (e) => {
      const norm = normalizeTVKey(e);
      if (isActivationKey(norm)) {
        activate(e);
        return;
      }
      if (typeof onKeyDown === 'function') {
        onKeyDown(e);
      }
    },
    [activate, onKeyDown]
  );

  const handleClick = useCallback(
    (e) => {
      // Mouse/touch click support for parity
      if (typeof onSelect === 'function') {
        activate(e);
      }
    },
    [activate, onSelect]
  );

  const handleFocus = useCallback(
    (e) => {
      if (typeof onFocus === 'function') onFocus(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e) => {
      if (typeof onBlur === 'function') onBlur(e);
    },
    [onBlur]
  );

  const mergedClassName = useMemo(() => {
    // Ensure focus-visible class is present so theme styles apply
    const base = 'focus-visible-outline';
    if (!className) return base;
    return `${className} ${base}`.trim();
  }, [className]);

  // Default A11Y props
  const a11y = {
    role: role || 'button',
    tabIndex: typeof tabIndex === 'number' ? tabIndex : 0,
    'aria-label': ariaLabel || rest['aria-label'],
  };

  return (
    <Component
      ref={setRefs}
      {...a11y}
      className={mergedClassName}
      data-focusable="true"
      data-focus-id={id || undefined}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      style={{ willChange: 'transform, box-shadow', ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </Component>
  );
});

export default TVFocusable;
