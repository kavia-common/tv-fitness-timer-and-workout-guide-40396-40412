import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * FocusManagerContext
 * Provides simple TV D-pad focus management scaffolding for Android TV remotes.
 * This is a minimal implementation to bootstrap navigation; it can be extended
 * later with grid awareness and spatial navigation heuristics.
 */
const FocusManagerContext = createContext({
  register: () => () => {},
  setInitialFocus: () => {},
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
 * - Listens to Arrow keys and Enter to move focus
 * - Keeps track of current focus id
 * - Exposes register() for focusable components
 */
export function FocusManagerProvider({ children, initialFocusId = null }) {
  const { register, getById, registryRef } = useFocusableRegistry();
  const [currentId, setCurrentId] = useState(initialFocusId);
  const initialFocusSetRef = useRef(false);

  // Set initial focus on first mount if provided
  const setInitialFocus = (id) => {
    setCurrentId(id);
    const entry = getById(id);
    if (entry && entry.ref?.current) {
      // Delay focus to ensure element is in DOM
      requestAnimationFrame(() => {
        entry.ref.current.focus();
      });
    }
  };

  useEffect(() => {
    if (initialFocusId && !initialFocusSetRef.current) {
      initialFocusSetRef.current = true;
      setInitialFocus(initialFocusId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFocusId]);

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
      next.ref.current.focus();
    }
  };

  // Handle D-pad/keyboard events
  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'Right': // some TV remotes
          e.preventDefault();
          moveFocus(1);
          break;
        case 'ArrowLeft':
        case 'Left':
          e.preventDefault();
          moveFocus(-1);
          break;
        case 'ArrowDown':
        case 'Down':
          e.preventDefault();
          moveFocus(1);
          break;
        case 'ArrowUp':
        case 'Up':
          e.preventDefault();
          moveFocus(-1);
          break;
        case 'Enter':
        case 'OK':
          // Let focused element handle click via :focus and keyboard handlers
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  const value = useMemo(
    () => ({
      register,
      setInitialFocus,
      currentId,
    }),
    [register, setInitialFocus, currentId]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
