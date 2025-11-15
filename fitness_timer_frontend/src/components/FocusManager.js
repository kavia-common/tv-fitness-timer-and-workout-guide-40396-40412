import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { normalizeTVKey, isArrow } from '../utils/tvKeyMap';

/**
 * PUBLIC_INTERFACE
 * FocusManagerContext
 * Provides TV D-pad focus management for Android TV remotes.
 * Exposes register, setInitialFocus, setFocus, getFocus to integrate with hooks/components.
 */
const FocusManagerContext = createContext({
  register: () => () => {},
  setInitialFocus: () => {},
  setFocus: () => {},
  getFocus: () => null,
  currentId: null,
});

/**
 * Focusable registry to store focusable elements and their DOM refs
 * Shape: { id: string, ref: React.RefObject, meta?: object }
 */
function useFocusableRegistry() {
  const registryRef = useRef(new Map());

  const register = (id, ref, meta = {}) => {
    const entry = { id, ref, meta };
    registryRef.current.set(id, entry);
    return () => {
      registryRef.current.delete(id);
    };
  };

  const getById = (id) => registryRef.current.get(id);

  return { register, getById, registryRef };
}

/**
 * PUBLIC_INTERFACE
 * FocusManagerProvider
 * Wrap your app in this provider to enable keyboard/D-pad focus handling.
 * - Listens to Arrow keys to move focus linearly when no grid handler overrides it
 * - Tracks current focus id
 * - Exposes register(), setInitialFocus(), setFocus(), getFocus()
 */
export function FocusManagerProvider({ children, initialFocusId = null }) {
  const { register, getById, registryRef } = useFocusableRegistry();
  const [currentId, setCurrentId] = useState(initialFocusId);
  const initialFocusSetRef = useRef(false);

  // Programmatic focus setter
  const setFocus = useCallback((id) => {
    setCurrentId(id);
    const entry = getById(id);
    if (entry && entry.ref?.current) {
      requestAnimationFrame(() => {
        try {
          entry.ref.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        } catch {
          entry.ref.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
        entry.ref.current.focus();
      });
    }
  }, [getById]);

  // Set initial focus on first mount if provided
  const setInitialFocus = useCallback((id) => {
    setFocus(id);
  }, [setFocus]);

  useEffect(() => {
    if (initialFocusId && !initialFocusSetRef.current) {
      initialFocusSetRef.current = true;
      setInitialFocus(initialFocusId);
    }
  }, [initialFocusId, setInitialFocus]);

  // Basic linear navigation fallback: order by insertion
  const getOrderedEntries = () => Array.from(registryRef.current.values());

  const moveFocus = (delta) => {
    const entries = getOrderedEntries();
    if (entries.length === 0) return;
    const currentIndex = Math.max(0, entries.findIndex((e) => e.id === currentId));
    let nextIndex = currentIndex + delta;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= entries.length) nextIndex = entries.length - 1;
    const next = entries[nextIndex];
    if (next && next.ref?.current) {
      setCurrentId(next.id);
      try {
        next.ref.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      } catch {
        next.ref.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      next.ref.current.focus();
    }
  };

  // Central keydown router: if no other hook consumes the event, provide linear navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = normalizeTVKey(e);
      if (!isArrow(k)) return;
      // provide lightweight default behavior if nothing else prevented it
      if (k === 'ArrowRight' || k === 'ArrowDown') {
        e.preventDefault();
        moveFocus(1);
      } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
        e.preventDefault();
        moveFocus(-1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentId]);

  const getFocus = useCallback(() => currentId, [currentId]);

  const value = useMemo(
    () => ({
      register,
      setInitialFocus,
      setFocus,
      getFocus,
      currentId,
    }),
    [register, setInitialFocus, setFocus, getFocus, currentId]
  );

  return <FocusManagerContext.Provider value={value}>{children}</FocusManagerContext.Provider>;
}

// PUBLIC_INTERFACE
export function useFocusManager() {
  /** Hook to access FocusManager context */
  return useContext(FocusManagerContext);
}

/**
 * PUBLIC_INTERFACE
 * Focusable
 * A helper component to make any child focusable and registered with the manager.
 * Usage:
 * <Focusable id="start-btn">
 *   <button>Start</button>
 * </Focusable>
 */
export function Focusable({ id, children, autoFocus = false, role = 'button', tabIndex = 0, className = '', ...rest }) {
  const { register, setInitialFocus } = useFocusManager();
  const ref = useRef(null);

  useEffect(() => {
    if (!id) return undefined;
    const unregister = register(id, ref);
    if (autoFocus) {
      // Schedule after mount
      requestAnimationFrame(() => setInitialFocus(id));
    }
    return unregister;
  }, [id, register, setInitialFocus]);

  // Clone child to attach ref and a11y props
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ref,
    role,
    tabIndex,
    className: `${className} focus-visible-outline`.trim(),
    ...rest,
  });
}
