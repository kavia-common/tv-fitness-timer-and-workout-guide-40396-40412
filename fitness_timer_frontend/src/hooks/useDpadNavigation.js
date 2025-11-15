import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeTVKey, isArrow, isActivationKey, isBackKey } from '../utils/tvKeyMap';

/**
 * PUBLIC_INTERFACE
 * useDpadNavigation
 * Hook for managing D-pad navigation in grid/row layouts.
 *
 * Params:
 * - options:
 *   - rowCount: number of rows in focusable grid
 *   - colCount: number of columns per row (or max columns)
 *   - initialRow: starting focused row index (default 0)
 *   - initialCol: starting focused column index (default 0)
 *   - onEnter(row, col): callback when user presses Enter/OK/Space
 *   - onBack(row, col): callback when user presses Back/Escape/Backspace
 *   - getRef(row, col): function returning ref to DOM element for focus/scroll
 *   - loop: boolean to loop within bounds (default false)
 *   - verticalFirst: boolean to prefer vertical navigation on Up/Down (default true)
 *
 * Returns:
 * - state:
 *   - focusedRowIndex
 *   - focusedColIndex
 * - handlers:
 *   - setFocused(row, col)
 * - effect: installs keydown listener for D-pad navigation
 */
export default function useDpadNavigation(options) {
  const {
    rowCount,
    colCount,
    initialRow = 0,
    initialCol = 0,
    onEnter,
    onBack,
    getRef,
    loop = false,
    verticalFirst = true,
  } = options || {};

  const [focusedRowIndex, setFocusedRowIndex] = useState(initialRow);
  const [focusedColIndex, setFocusedColIndex] = useState(initialCol);
  const containerRef = useRef(null);

  const setFocused = useCallback((r, c) => {
    setFocusedRowIndex(r);
    setFocusedColIndex(c);
    // Try to focus/scroll to the element
    if (typeof getRef === 'function') {
      const ref = getRef(r, c);
      const el = ref && ref.current;
      if (el && el.scrollIntoView) {
        // Use smooth scroll and try to center in view horizontally
        try {
          el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        } catch {
          el.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      }
      if (el && typeof el.focus === 'function') {
        // delay to align with scroll
        requestAnimationFrame(() => el.focus());
      }
    }
  }, [getRef]);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const handleArrow = useCallback((key) => {
    let nextRow = focusedRowIndex;
    let nextCol = focusedColIndex;

    if (key === 'ArrowUp') {
      nextRow = focusedRowIndex - 1;
      if (nextRow < 0) nextRow = loop ? rowCount - 1 : 0;
    } else if (key === 'ArrowDown') {
      nextRow = focusedRowIndex + 1;
      if (nextRow >= rowCount) nextRow = loop ? 0 : rowCount - 1;
    } else if (key === 'ArrowLeft') {
      nextCol = focusedColIndex - 1;
      if (nextCol < 0) nextCol = loop ? colCount - 1 : 0;
    } else if (key === 'ArrowRight') {
      nextCol = focusedColIndex + 1;
      if (nextCol >= colCount) nextCol = loop ? 0 : colCount - 1;
    }

    nextRow = clamp(nextRow, 0, Math.max(0, (rowCount || 1) - 1));
    nextCol = clamp(nextCol, 0, Math.max(0, (colCount || 1) - 1));
    setFocused(nextRow, nextCol);
  }, [focusedRowIndex, focusedColIndex, loop, rowCount, colCount, setFocused]);

  const onKeyDown = useCallback((e) => {
    const norm = normalizeTVKey(e);
    if (isArrow(norm) || isActivationKey(norm) || isBackKey(norm)) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isArrow(norm)) {
      handleArrow(norm);
      return;
    }
    if (isActivationKey(norm)) {
      if (typeof onEnter === 'function') {
        onEnter(focusedRowIndex, focusedColIndex);
      }
      return;
    }
    if (isBackKey(norm)) {
      if (typeof onBack === 'function') {
        onBack(focusedRowIndex, focusedColIndex);
      }
    }
  }, [handleArrow, onEnter, onBack, focusedRowIndex, focusedColIndex]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return {
    focusedRowIndex,
    focusedColIndex,
    setFocused,
    containerRef,
  };
}
