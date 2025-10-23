/**
 * Micro-interactions Library - 2025 Fluent 2 & Material Design 3
 * Tasteful, subtle animations that enhance UX without overwhelming
 */

import { prefersReducedMotion } from './view-transitions';

/**
 * Haptic feedback simulation (where supported)
 */
export function triggerHapticFeedback(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  if (prefersReducedMotion()) {
    return;
  }

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
  };

  navigator.vibrate(patterns[intensity]);
}

/**
 * Spring animation values - Fluent 2 inspired
 */
export const SPRING_CONFIGS = {
  gentle: {
    tension: 120,
    friction: 14,
    duration: 300,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  moderate: {
    tension: 180,
    friction: 12,
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  snappy: {
    tension: 300,
    friction: 20,
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

/**
 * Ripple effect for buttons (Material Design 3)
 */
export function createRippleEffect(
  event: React.MouseEvent<HTMLElement>,
  color: string = 'rgba(255, 255, 255, 0.3)'
): void {
  if (prefersReducedMotion()) return;

  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${color};
    transform: scale(0);
    animation: ripple 600ms ease-out;
    pointer-events: none;
  `;

  // Ensure button has position relative
  if (getComputedStyle(button).position === 'static') {
    button.style.position = 'relative';
  }
  button.style.overflow = 'hidden';

  button.appendChild(ripple);

  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
}

/**
 * Add ripple animation to CSS if not exists
 */
if (typeof document !== 'undefined' && !document.getElementById('ripple-animation')) {
  const style = document.createElement('style');
  style.id = 'ripple-animation';
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Floating label animation
 */
export function useFloatingLabel(
  inputValue: string,
  isFocused: boolean
): {
  labelScale: number;
  labelY: number;
} {
  const hasValue = inputValue.length > 0;
  const isActive = isFocused || hasValue;

  return {
    labelScale: isActive ? 0.75 : 1,
    labelY: isActive ? -24 : 0,
  };
}

/**
 * Stagger animation helper
 */
export function getStaggerDelay(index: number, baseDelay: number = 50): string {
  if (prefersReducedMotion()) return '0ms';
  return `${index * baseDelay}ms`;
}

/**
 * Skeleton shimmer effect class generator
 */
export function getSkeletonClass(width?: string | number, height?: string | number): string {
  const w = typeof width === 'number' ? `${width}px` : width || '100%';
  const h = typeof height === 'number' ? `${height}px` : height || '1rem';
  
  return `skeleton inline-block`;
}

/**
 * Toast/Snackbar animation variants
 */
export const TOAST_ANIMATIONS = {
  slideInRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  slideInTop: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.2, ease: [0.2, 0, 0, 1] },
  },
} as const;

/**
 * Scroll reveal helper
 */
export function useScrollReveal(threshold: number = 0.1) {
  if (typeof IntersectionObserver === 'undefined') {
    return { ref: null, isVisible: true };
  }

  const ref = { current: null } as { current: HTMLElement | null };
  let isVisible = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible = true;
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  return { ref, isVisible };
}

/**
 * Magnetic button effect (Fluent 2 inspired)
 */
export function createMagneticEffect(
  element: HTMLElement,
  strength: number = 0.3
): () => void {
  if (prefersReducedMotion()) {
    return () => {};
  }

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handleMouseLeave = () => {
    element.style.transform = '';
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Pulse animation on focus/interaction
 */
export function pulseOnFocus(element: HTMLElement, color: string = 'rgba(22, 163, 74, 0.3)'): void {
  if (prefersReducedMotion()) return;

  element.style.animation = 'pulse 0.5s ease-out';
  element.style.setProperty('--pulse-color', color);

  setTimeout(() => {
    element.style.animation = '';
  }, 500);
}

/**
 * Add pulse animation CSS
 */
if (typeof document !== 'undefined' && !document.getElementById('pulse-animation')) {
  const style = document.createElement('style');
  style.id = 'pulse-animation';
  style.textContent = `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 var(--pulse-color, rgba(22, 163, 74, 0.4));
      }
      70% {
        box-shadow: 0 0 0 10px rgba(22, 163, 74, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Loading states
 */
export const LOADING_STATES = {
  spinner: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  shimmer: 'skeleton',
} as const;

/**
 * Button press effect (scale down on active)
 */
export function applyPressEffect(element: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const handleMouseDown = () => {
    element.style.transform = 'scale(0.98)';
  };

  const handleMouseUp = () => {
    element.style.transform = '';
  };

  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mouseup', handleMouseUp);
  element.addEventListener('mouseleave', handleMouseUp);
}

