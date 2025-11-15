import React, { useEffect } from 'react';
import '../theme/oceanTheme.css';

/**
 * PUBLIC_INTERFACE
 * ScreenWrapper
 * Wraps screen content with Ocean Professional theme base styles for TV-scale UI.
 * - Applies data-theme attribute to documentElement
 * - Sets root font size (rem base) targeting 10-foot experience
 * - Provides padded, gradient background container
 *
 * Props:
 * - theme: 'light' | 'dark' (string) - used to set data-theme attribute (reserved for future dark mode)
 * - className: additional class names for the container
 * - style: inline style overrides
 * - children: ReactNode
 */
export default function ScreenWrapper({ theme = 'light', className = '', style = {}, children }) {
  useEffect(() => {
    // Set data-theme for global CSS vars (future dark mode support)
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    // Set a TV-scale base font size for rem units (18–22px recommended)
    document.documentElement.style.setProperty('--font-size-base', '20px');
    document.documentElement.style.fontSize = 'var(--font-size-base)';
  }, [theme]);

  return (
    <div
      className={`screen-wrapper bg-ocean-ambient px-container py-screen ${className}`}
      style={{
        minHeight: '100vh',
        color: 'var(--color-text)',
        ...style
      }}
      data-theme={theme}
    >
      {children}
    </div>
  );
}
