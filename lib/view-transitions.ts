/**
 * View Transitions API Helper (2025 Modern Web Platform)
 * Provides smooth page transitions with fallback for unsupported browsers
 * https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

/**
 * Check if View Transitions API is supported
 */
export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

/**
 * Execute a callback with view transition if supported
 * Falls back to immediate execution if not supported
 */
export function withViewTransition(callback: () => void | Promise<void>): void {
  if (!supportsViewTransitions()) {
    callback();
    return;
  }

  // @ts-ignore - View Transitions API type support
  document.startViewTransition(async () => {
    await callback();
  });
}

/**
 * Navigate with view transition (for use with Next.js router)
 */
export function transitionNavigate(
  callback: () => void | Promise<void>,
  options?: {
    duration?: number;
    easing?: string;
  }
): void {
  const { duration = 300, easing = 'ease-out' } = options || {};

  if (!supportsViewTransitions()) {
    callback();
    return;
  }

  // Set custom transition duration via CSS
  const style = document.createElement('style');
  style.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: ${duration}ms;
      animation-timing-function: ${easing};
    }
  `;
  document.head.appendChild(style);

  // @ts-ignore
  document.startViewTransition(async () => {
    await callback();
  }).finished.finally(() => {
    style.remove();
  });
}

/**
 * Create a named view transition for specific elements
 * Usage: Add `style={{ viewTransitionName: 'unique-name' }}` to element
 */
export function createNamedTransition(name: string, callback: () => void | Promise<void>): void {
  if (!supportsViewTransitions()) {
    callback();
    return;
  }

  // @ts-ignore
  document.startViewTransition(callback);
}

/**
 * Prefers reduced motion check
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Execute transition only if user doesn't prefer reduced motion
 */
export function withRespectToMotionPreference(
  callback: () => void | Promise<void>,
  immediateCallback?: () => void
): void {
  if (prefersReducedMotion()) {
    if (immediateCallback) {
      immediateCallback();
    } else {
      callback();
    }
    return;
  }

  withViewTransition(callback);
}

