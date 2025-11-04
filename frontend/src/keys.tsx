import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon } from '@navikt/aksel-icons';

export const CMD = '⌘';
export const CTRL = 'Ctrl';
export const IS_WINDOWS = navigator.platform.startsWith('Win');
export const IS_LINUX = navigator.platform.startsWith('Linux');
export const IS_MAC = navigator.platform.startsWith('Mac');
export const MOD_KEY_TEXT = IS_MAC ? CMD : CTRL;

interface KeyEvent {
  metaKey: boolean;
  ctrlKey: boolean;
}

export const isMetaKey: (event: KeyEvent) => boolean = IS_MAC ? (event) => event.metaKey : (event) => event.ctrlKey;

export enum Keys {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  PageUp = 'PageUp',
  PageDown = 'PageDown',
  Home = 'Home',
  End = 'End',
  Escape = 'Escape',
  // Special characters
  Period = '.',
  Comma = ',',
  Colon = ':',
  Semicolon = ';',
  Exclamation = '!',
  Question = '?',
  Dash = '-',
  Slash = '/',
  Parenthesis = ')',
  Bracket = ']',
  Brace = '}',
  AngleBracket = '>',
  Asterisk = '*',
  Quote = '"',
  Guillemet = '»',
  Equals = '=',
  Plus = '+',
  // Modifiers
  Ctrl = 'Control',
  Cmd = 'Meta',
  Shift = 'Shift',
  Alt = 'Alt',
  Tab = 'Tab',
  // Alphanumeric keys
  Space = ' ',
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  F = 'f',
  G = 'g',
  H = 'h',
  I = 'i',
  J = 'j',
  K = 'k',
  L = 'l',
  M = 'm',
  N = 'n',
  S = 's',
  V = 'v',
  Zero = '0',
  // Function keys
  F2 = 'F2',
}

export const MOD_KEY = IS_MAC ? Keys.Cmd : Keys.Ctrl;

export enum MouseButtons {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

export const KEY_ICONS: Record<Keys, React.ReactNode> = {
  [Keys.Enter]: 'Enter',
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
  [Keys.Ctrl]: CTRL,
  [Keys.Cmd]: CMD,
  [Keys.Shift]: 'Shift',
  [Keys.Alt]: 'Alt',
  [Keys.Tab]: 'Tab',
  [Keys.Period]: '.',
  [Keys.Comma]: ',',
  [Keys.Colon]: ':',
  [Keys.Semicolon]: ';',
  [Keys.Exclamation]: '!',
  [Keys.Question]: '?',
  [Keys.Dash]: '-',
  [Keys.Slash]: '/',
  [Keys.Parenthesis]: ')',
  [Keys.Bracket]: ']',
  [Keys.Brace]: '}',
  [Keys.AngleBracket]: '>',
  [Keys.Asterisk]: '*',
  [Keys.Quote]: '"',
  [Keys.Guillemet]: '»',
  [Keys.Equals]: '=',
  [Keys.Plus]: '+',
  [Keys.A]: 'A',
  [Keys.B]: 'B',
  [Keys.C]: 'C',
  [Keys.D]: 'D',
  [Keys.F]: 'F',
  [Keys.G]: 'G',
  [Keys.H]: 'H',
  [Keys.I]: 'I',
  [Keys.J]: 'J',
  [Keys.K]: 'K',
  [Keys.L]: 'L',
  [Keys.M]: 'M',
  [Keys.N]: 'N',
  [Keys.S]: 'S',
  [Keys.V]: 'V',
  [Keys.Zero]: '0',
  [Keys.F2]: 'F2',
};
