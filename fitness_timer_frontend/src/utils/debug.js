//
// PUBLIC_INTERFACE
// debug.js
// Minimal gated logger for focus/keydown debugging without console spam.
// Controlled by feature flags via theme/index.js -> getFeatureFlags().debugFocus
//
let cached = null;

/**
 * Resolve debug flag lazily to avoid importing theme in every module.
 */
function isDebugEnabled() {
  if (cached === null) {
    try {
      const raw = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_FEATURE_FLAGS) || '';
      // Try JSON parse first
      let flags = {};
      if (raw) {
        try {
          const maybe = JSON.parse(raw);
          if (maybe && typeof maybe === 'object') flags = maybe;
        } catch {
          // Fallback to tokens
          String(raw)
            .split(/[,\s]+/)
            .map((t) => t.trim())
            .filter(Boolean)
            .forEach((kv) => {
              const [k, v] = kv.split('=');
              if (!k) return;
              if (typeof v === 'undefined') flags[k] = true;
              else if (v === 'true' || v === '1') flags[k] = true;
              else if (v === 'false' || v === '0') flags[k] = false;
              else flags[k] = v;
            });
        }
      }
      const nodeEnv = (process && process.env && process.env.REACT_APP_NODE_ENV) || '';
      const devDefault = String(nodeEnv).toLowerCase() === 'development';
      cached = typeof flags.debugFocus === 'boolean' ? flags.debugFocus : !!devDefault;
    } catch {
      cached = false;
    }
  }
  return cached;
}

// PUBLIC_INTERFACE
export function debugLog(scope, ...args) {
  /** Log concise debug messages when debugFocus flag is enabled. */
  if (!isDebugEnabled()) return;
  try {
    // Keep logs concise to avoid spam
    // eslint-disable-next-line no-console
    console.log(`[DBG:${scope}]`, ...args);
  } catch {
    /* noop */
  }
}

// PUBLIC_INTERFACE
export function setDebugCache(value) {
  /** Manually override cache for tests */
  cached = !!value;
}
