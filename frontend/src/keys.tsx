import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@navikt/aksel-icons';

export const CMD = '⌘';
export const CTRL = 'Ctrl';
export const IS_MAC = /mac os x/i.test(navigator.userAgent);
export const MOD_KEY_TEXT = IS_MAC ? CMD : CTRL;

interface KeyEvent {
  metaKey: boolean;
  ctrlKey: boolean;
}

export const isMetaKey = (event: KeyEvent) => (IS_MAC ? event.metaKey : event.ctrlKey);

export enum Keys {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
  Home = 'Home',
  End = 'End',
  Escape = 'Escape',
  Space = ' ',
  Enter = 'Enter',
  Ctrl = 'Control',
  Cmd = 'Meta',
  Shift = 'Shift',
  Alt = 'Alt',
  Tab = 'Tab',
  Equals = '=',
  Minus = '-',
  Plus = '+',
  A = 'a',
  D = 'd',
  F = 'f',
  G = 'g',
  H = 'h',
  I = 'i',
  J = 'j',
  K = 'k',
  L = 'l',
  N = 'n',
  S = 's',
  V = 'v',
  Zero = '0',
}

export const MOD_KEY = IS_MAC ? Keys.Cmd : Keys.Ctrl;

export enum MouseButtons {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export const KEY_ICONS: Record<Keys, React.ReactNode> = {
  [Keys.ArrowUp]: <ArrowUpIcon aria-hidden />,
  [Keys.ArrowDown]: <ArrowDownIcon aria-hidden />,
  [Keys.ArrowLeft]: <ArrowLeftIcon aria-hidden />,
  [Keys.ArrowRight]: <ArrowRightIcon aria-hidden />,
  [Keys.PageUp]: 'PgUp',
  [Keys.PageDown]: 'PgDn',
  [Keys.Home]: 'Home',
  [Keys.End]: 'End',
  [Keys.Escape]: 'Esc',
  [Keys.Space]: 'Space',
  [Keys.Enter]: 'Enter',
  [Keys.Ctrl]: CTRL,
  [Keys.Cmd]: CMD,
  [Keys.Shift]: 'Shift',
  [Keys.Alt]: 'Alt',
  [Keys.Tab]: 'Tab',
  [Keys.Equals]: '=',
  [Keys.Minus]: '-',
  [Keys.Plus]: '+',
  [Keys.A]: 'A',
  [Keys.D]: 'D',
  [Keys.F]: 'F',
  [Keys.G]: 'G',
  [Keys.H]: 'H',
  [Keys.I]: 'I',
  [Keys.J]: 'J',
  [Keys.K]: 'K',
  [Keys.L]: 'L',
  [Keys.N]: 'N',
  [Keys.S]: 'S',
  [Keys.V]: 'V',
  [Keys.Zero]: '0',
};
