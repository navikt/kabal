export const CMD = '⌘';
export const CTRL = 'Ctrl';
export const IS_MAC = /mac os x/i.test(navigator.userAgent);
export const MOD_KEY = IS_MAC ? CMD : CTRL;

export enum MouseButtons {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}
