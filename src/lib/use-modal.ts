'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Dialogs can stack (the item viewer opens over the journal): only the one on top reacts to Escape and Tab.
const stack: symbol[] = [];

function visibleFocusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden');
}

/**
 * The keyboard behaviour every modal dialog needs: Tab and Shift+Tab stay inside it, Escape closes it
 * (only the topmost one), and closing it puts focus back where it was when it opened. Pass `onClose` as
 * `undefined` for a dialog that must be answered (it then traps focus but ignores Escape).
 */
export function useModal(ref: RefObject<HTMLElement | null>, onClose?: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const id = Symbol('modal');
    stack.push(id);
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Focus lands inside the dialog even when no element asked for it (autoFocus runs before this).
    if (!root.contains(document.activeElement)) (visibleFocusables(root)[0] ?? root).focus();

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape' && closeRef.current) {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = visibleFocusables(root);
      if (!items.length) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (!root.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      const at = stack.indexOf(id);
      if (at >= 0) stack.splice(at, 1);
      // Back to the control that opened the dialog, unless it is gone or focus has already moved on.
      if (opener?.isConnected && (document.activeElement === document.body || root.contains(document.activeElement) || !document.activeElement)) opener.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
