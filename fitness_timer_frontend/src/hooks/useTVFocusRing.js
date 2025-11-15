import { useCallback, useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * useTVFocusRing
 * Manages focus ring classnames for TV-focused elements.
 *
 * Returns:
 * - ref: attach to the focusable element
 * - setFocused(focused: boolean): to toggle focus class manually
 * - focus(): move focus programmatically
 */
export default function useTVFocusRing() {
  const ref = useRef(null);
  const FOCUS_CLASS = 'focus-visible-outline';

  const setFocused = useCallback((focused) => {
    const el = ref.current;
    if (!el) return;
    if (focused) {
      el.classList.add(FOCUS_CLASS);
      try {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      } catch {
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    } else {
      el.classList.remove(FOCUS_CLASS);
    }
  }, []);

  const focus = useCallback(() => {
    const el = ref.current;
    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  }, []);

  // Ensure class is applied on native focus-visible as well
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const onFocus = () => el.classList.add(FOCUS_CLASS);
    const onBlur = () => el.classList.remove(FOCUS_CLASS);
    el.addEventListener('focus', onFocus);
    el.addEventListener('blur', onBlur);
    return () => {
      el.removeEventListener('focus', onFocus);
      el.removeEventListener('blur', onBlur);
    };
  }, []);

  return { ref, setFocused, focus };
}
