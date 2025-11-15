//
// PUBLIC_INTERFACE
// src/theme/index.js
// Feature flags utilities for the TV Fitness Timer app.
// Safely parses optional environment variables to derive feature flags and
// provides helpers to apply them as data-attributes or CSS classes.
//
// Supported env vars (injected at build time by CRA):
// - REACT_APP_FEATURE_FLAGS: Either a JSON string or a comma-separated list.
//   Examples:
//     REACT_APP_FEATURE_FLAGS='{"animationsOff":true,"debugFocus":false}'
//     REACT_APP_FEATURE_FLAGS="animationsOff,debugFocus"
// - REACT_APP_NODE_ENV: Optional environment indicator; if "development" we may
//   turn on some dev-friendly flags by default (e.g., debugFocus).
//
// Flags:
// - animationsOff: boolean (default false) — When true, reduces or disables motion.
// - debugFocus: boolean (default false) — When true, adds classes/attributes helpful
//   for debugging focus state.
//
// PUBLIC_INTERFACE
export function getFeatureFlags() {
  /**
   * Returns a frozen object with the feature flags resolved from environment variables.
   * Safe parsing with sensible defaults:
   *  - animationsOff: false
   *  - debugFocus: false
   */
  const defaults = {
    animationsOff: false,
    debugFocus: false,
  };

  const envFlagsRaw =
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.REACT_APP_FEATURE_FLAGS) ||
    '';

  const envNodeEnv =
    (typeof process !== 'undefined' &&
      process.env &&
      process.env.REACT_APP_NODE_ENV) ||
    '';

  let parsed = {};
  if (envFlagsRaw) {
    // Try JSON first, fallback to comma-separated list.
    try {
      const maybe = JSON.parse(envFlagsRaw);
      if (maybe && typeof maybe === 'object') {
        parsed = maybe;
      }
    } catch {
      // Fallback: comma or whitespace separated tokens
      const tokens = String(envFlagsRaw)
        .split(/[,\s]+/)
        .map((t) => t.trim())
        .filter(Boolean);
      parsed = tokens.reduce((acc, key) => {
        // Allow key=true/false or just "key"
        const [k, v] = key.split('=');
        if (!k) return acc;
        if (typeof v === 'undefined') {
          acc[k] = true;
        } else if (v === 'true' || v === '1') {
          acc[k] = true;
        } else if (v === 'false' || v === '0') {
          acc[k] = false;
        } else {
          acc[k] = v;
        }
        return acc;
      }, {});
    }
  }

  // Derive sensible environment defaults
  // If REACT_APP_NODE_ENV indicates development, enable debugFocus unless explicitly set.
  if (String(envNodeEnv).toLowerCase() === 'development') {
    if (typeof parsed.debugFocus === 'undefined') {
      parsed.debugFocus = true;
    }
  }

  // Merge with defaults on a per-flag basis.
  const flags = {
    animationsOff:
      typeof parsed.animationsOff === 'boolean'
        ? parsed.animationsOff
        : defaults.animationsOff,
    debugFocus:
      typeof parsed.debugFocus === 'boolean'
        ? parsed.debugFocus
        : defaults.debugFocus,
  };

  return Object.freeze(flags);
}

// PUBLIC_INTERFACE
export function applyFlagsToDocument(flags) {
  /**
   * Applies feature flags as data-attributes on document.documentElement.
   * This enables CSS to react to flags using attribute selectors, e.g.:
   * html[data-animations-off="true"] * { transition: none !important; animation: none !important; }
   */
  if (typeof document === 'undefined' || !document.documentElement) return;

  try {
    document.documentElement.setAttribute(
      'data-animations-off',
      String(!!flags.animationsOff)
    );
    document.documentElement.setAttribute(
      'data-debug-focus',
      String(!!flags.debugFocus)
    );
  } catch {
    // no-op if DOM not available
  }
}

// PUBLIC_INTERFACE
export function getFlagClassNames(flags) {
  /**
   * Returns space-separated class names derived from flags.
   * Example usage:
   *   const flags = getFeatureFlags();
   *   const className = `screen ${getFlagClassNames(flags)}`;
   */
  const classes = [];
  if (flags.animationsOff) classes.push('ff-animations-off');
  if (flags.debugFocus) classes.push('ff-debug-focus');
  return classes.join(' ');
}

// PUBLIC_INTERFACE
export function initFeatureFlags() {
  /**
   * Convenience initializer: resolves flags and applies them to document.
   * Returns the resolved flags so callers can also use class names if desired.
   */
  const flags = getFeatureFlags();
  applyFlagsToDocument(flags);
  return flags;
}

// Immediately apply flags on import for global CSS effects,
// but keep it safe for environments without document (e.g., tests, SSR).
(() => {
  try {
    initFeatureFlags();
  } catch {
    // ignore
  }
})();

