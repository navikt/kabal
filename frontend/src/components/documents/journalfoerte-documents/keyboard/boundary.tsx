import { setKeyboardActive } from '@app/components/documents/journalfoerte-documents/keyboard/state/keyboard-active';
import { useKeyboard } from '@app/components/documents/journalfoerte-documents/keyboard/use-keyboard';
import { Keys, isMetaKey } from '@app/keys';
import { Box } from '@navikt/ds-react';
import { useEffect } from 'react';

interface KeyboardBoundaryProps {
  children: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
}

export const KeyboardBoundary = ({ children, ref }: KeyboardBoundaryProps) => {
  const onKeyDown = useKeyboard();

  useEffect(() => {
    // Set the initial keyboard active state based on the current focused element.
    setKeyboardActive(document.activeElement !== null && document.activeElement === ref.current);

    const listener = (e: KeyboardEvent) => {
      if (!e.defaultPrevented && isMetaKey(e) && e.key === Keys.J) {
        e.preventDefault();
        ref.current?.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [ref.current]);

  const onFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (e.target === ref.current) {
      setKeyboardActive(true);
      return;
    }
  };

  const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (e.target === ref.current) {
      setKeyboardActive(false);
      return;
    }
  };

  return (
    <Box
      position="relative"
      minHeight="100%"
      flexShrink="0"
      height="fit-content"
      flexGrow="1"
      paddingBlock="0"
      marginBlock="0 8"
      overflow="hidden"
    >
      <Box
        borderRadius="medium"
        minHeight="100%"
        flexShrink="0"
        overflow="hidden"
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={() => ref.current?.focus({ preventScroll: true })}
        tabIndex={0}
        ref={ref}
        aria-keyshortcuts={ARIA_KEYSHORTCUTS_STRING}
      >
        {children}
      </Box>
    </Box>
  );
};

/**
 * `' '` is not a valid key in the ARIA spec, `'Space'` is used instead.
 * @see https://w3c.github.io/aria/#aria-keyshortcuts
 */
const ARIA_KEYSHORTCUTS: (Exclude<Keys, Keys.Space> | 'Space')[][] = [
  [Keys.ArrowUp],
  [Keys.ArrowDown],
  [Keys.Home],
  [Keys.End],
  [Keys.Shift, Keys.Home],
  [Keys.Shift, Keys.End],
  [Keys.Cmd, Keys.ArrowUp],
  [Keys.Cmd, Keys.ArrowDown],
  [Keys.Ctrl, Keys.ArrowUp],
  [Keys.Ctrl, Keys.ArrowDown],
  [Keys.Shift, Keys.ArrowUp],
  [Keys.Shift, Keys.ArrowDown],
  [Keys.Ctrl, Keys.Shift, Keys.ArrowUp],
  [Keys.Ctrl, Keys.Shift, Keys.ArrowDown],
  [Keys.Cmd, Keys.Shift, Keys.ArrowUp],
  [Keys.Cmd, Keys.Shift, Keys.ArrowDown],
  [Keys.ArrowRight],
  [Keys.Cmd, Keys.ArrowRight],
  [Keys.Ctrl, Keys.ArrowRight],
  [Keys.ArrowLeft],
  [Keys.Cmd, Keys.ArrowLeft],
  [Keys.Ctrl, Keys.ArrowLeft],
  [Keys.Cmd, Keys.A],
  [Keys.Cmd, Keys.C],
  [Keys.H],
  [Keys.F],
  [Keys.N],
  [Keys.V],
  [Keys.I],
  [Keys.D],
  ['Space'],
  [Keys.Shift, 'Space'],
  [Keys.Enter],
  [Keys.Cmd, Keys.Enter],
  [Keys.Ctrl, Keys.Enter],
  [Keys.Cmd, Keys.Shift, Keys.D],
  [Keys.Escape],
  [Keys.Cmd, Keys.J],
  [Keys.Ctrl, Keys.J],
];

const ARIA_KEYSHORTCUTS_STRING: string = ARIA_KEYSHORTCUTS.map((keys) => keys.join('+')).join(' ');
