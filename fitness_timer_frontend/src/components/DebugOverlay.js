import React, { useEffect, useState } from 'react';
import { getFeatureFlags } from '../theme';
import { normalizeTVKey } from '../utils/tvKeyMap';
import { debugLog } from '../utils/debug';

/**
 * PUBLIC_INTERFACE
 * DebugOverlay
 * A small on-screen overlay to display current focus id and last key pressed.
 * Shown only when REACT_APP_FEATURE_FLAGS includes debugFocus=true.
 */
export default function DebugOverlay() {
  const { debugFocus } = getFeatureFlags();
  const [lastKey, setLastKey] = useState('');
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!debugFocus) return undefined;

    const onKeyDown = (e) => {
      const k = normalizeTVKey(e);
      setLastKey(k);
      try {
        const el = document.activeElement;
        const id = el?.getAttribute?.('data-focus-id') || el?.id || '';
        setActiveId(id);
      } catch {
        /* ignore */
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    debugLog('DebugOverlay', 'attached');
    return () => {
      try {
        window.removeEventListener('keydown', onKeyDown, true);
      } catch {
        /* ignore */
      }
    };
  }, [debugFocus]);

  if (!debugFocus) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 12,
        bottom: 12,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.65)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 12,
        padding: '8px 10px',
        fontSize: 14,
        lineHeight: 1.35,
        boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
        pointerEvents: 'none',
        minWidth: 180,
      }}
    >
      <div><strong>Focus</strong>: {activeId || '(none)'}</div>
      <div><strong>Last key</strong>: {lastKey || '(n/a)'}</div>
    </div>
  );
}
