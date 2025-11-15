import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { normalizeTVKey, isArrow } from '../utils/tvKeyMap';
import { debugLog } from '../utils/debug';

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
  getCurrentDom: () => null,
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
  const listenerAttachedRef = useRef(false);

  // Programmatic focus setter
  const setFocus = useCallback(
    (id) => {
      setCurrentId(id);
      const entry = getById(id);
      const node = entry?.ref?.current;
      if (node) {
        requestAnimationFrame(() => {
          // Robust scrollIntoView with guards
          try {
            if (typeof node.scrollIntoView === 'function') {
              node.scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
                behavior: 'smooth',
              });
            }
          } catch {
            try {
              node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } catch {
              /* ignore */
            }
          }
          try {
            if (typeof node.focus === 'function') node.focus();
          } catch {
            /* ignore */
          }
        });
      }
    },
    [getById]
  );

  // Set initial focus on first mount if provided
  const setInitialFocus = useCallback(
    (id) => {
      debugLog('FocusManager', 'setInitialFocus', id);
      setFocus(id);
    },
    [setFocus]
  );

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
    const node = next?.ref?.current;
    if (next && node) {
      setCurrentId(next.id);
      try {
        if (typeof node.scrollIntoView === 'function') {
          node.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
      } catch {
        try {
          node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } catch {
          /* ignore */
        }
      }
      try {
        if (typeof node.focus === 'function') node.focus();
      } catch {
        /* ignore */
      }
    }
  };

  // Central keydown router: attach once, capture phase, prevent default only for handled arrow keys.
  useEffect(() => {
    if (listenerAttachedRef.current) return undefined;

    const onKeyDown = (e) => {
      const k = normalizeTVKey(e);
      if (!isArrow(k)) return;
      // prevent native scroll only for handled arrow keys
      try {
        e.preventDefault();
        e.stopPropagation();
      } catch {
        /* noop */
      }
      debugLog('FocusManager', 'keydown', k, 'currentId=', currentId);
      if (k === 'ArrowRight' || k === 'ArrowDown') {
        moveFocus(1);
      } else if (k === 'ArrowLeft' || k === 'ArrowUp') {
        moveFocus(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown, true); // capture
    listenerAttachedRef.current = true;
    debugLog('FocusManager', 'global keydown listener attached');

    return () => {
      try {
        window.removeEventListener('keydown', onKeyDown, true);
        listenerAttachedRef.current = false;
        debugLog('FocusManager', 'global keydown listener removed');
      } catch {
        /* ignore */
      }
    };
    // attach once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFocus = useCallback(() => currentId, [currentId]);
  const getCurrentDom = useCallback(() => {
    const entry = getById(currentId);
    return entry?.ref?.current || null;
  }, [currentId, getById]);

  const value = useMemo(
    () => ({
      register,
      setInitialFocus,
      setFocus,
      getFocus,
      getCurrentDom,
      currentId,
    }),
    [register, setInitialFocus, setFocus, getFocus, getCurrentDom, currentId]
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
export function Focusable({
  id,
  children,
  autoFocus = false,
  role = 'button',
  tabIndex = 0,
  className = '',
  ...rest
}) {
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
  }, [id, register, setInitialFocus, autoFocus]);

  // Clone child to attach ref and a11y props
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    ref,
    role: role || 'button',
    tabIndex: typeof tabIndex === 'number' ? tabIndex : 0,
    className: `${className} focus-visible-outline`.trim(),
    ...rest,
  });
}
