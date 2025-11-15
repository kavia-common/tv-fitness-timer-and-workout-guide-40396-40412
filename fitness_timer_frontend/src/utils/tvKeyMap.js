//
// PUBLIC_INTERFACE
// tvKeyMap.js
// Normalizes TV/desktop keyboard events to a consistent key string and provides helpers.
// Handles common TV remote variations: Arrow keys, OK/Enter, Back/Backspace/Escape.
//
/**
 * PUBLIC_INTERFACE
 * normalizeTVKey
 * Returns a normalized key string for a KeyboardEvent across TV remotes and browsers.
 */
export function normalizeTVKey(e) {
  const key = (e && e.key) ? e.key : '';
  const code = (e && e.code) ? e.code : '';

  // Normalize arrows
  if (key === 'ArrowUp' || key === 'Up') return 'ArrowUp';
  if (key === 'ArrowDown' || key === 'Down') return 'ArrowDown';
  if (key === 'ArrowLeft' || key === 'Left') return 'ArrowLeft';
  if (key === 'ArrowRight' || key === 'Right') return 'ArrowRight';

  // Enter/OK keys
  if (key === 'Enter' || key === 'OK' || code === 'Enter' || code === 'NumpadEnter') return 'Enter';

  // Back keys: Escape, Backspace, BrowserBack
  if (key === 'Back' || key === 'Escape' || key === 'Esc' || key === 'Backspace') return 'Back';

  // Space as click on TVs sometimes
  if (key === ' ' || key === 'Spacebar' || key === 'Space') return 'Space';

  return key;
}

/**
 * PUBLIC_INTERFACE
 * isArrow
 * Returns true if key is any arrow key.
 */
export function isArrow(key) {
  return key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight';
}

/**
 * PUBLIC_INTERFACE
 * isActivationKey
 * Returns true if key should activate/select an item (Enter/OK/Space).
 */
export function isActivationKey(key) {
  return key === 'Enter' || key === 'Space';
}

/**
 * PUBLIC_INTERFACE
 * isBackKey
 * Returns true if key should act as Back (Back/Escape/Backspace).
 */
export function isBackKey(key) {
  return key === 'Back';
}
