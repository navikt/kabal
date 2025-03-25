import { IS_MAC } from '@app/keys';

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
  I = 'i',
  M = 'm',
  V = 'v',
  L = 'l',
  N = 'n',
  H = 'h',
  A = 'a',
  Ctrl = 'Control',
  Cmd = 'Meta',
  Shift = 'Shift',
  Alt = 'Alt',
}

export const MOD_KEY_ENUM = IS_MAC ? Keys.Cmd : Keys.Ctrl;
