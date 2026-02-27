import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { AppTheme, getAppThemeKey, getSystemTheme, resolveTheme } from '@app/theme';

describe('getAppThemeKey', () => {
  test('returns navIdent prefixed key', () => {
    expect(getAppThemeKey('Z123456')).toBe('Z123456/app_theme');
  });

  test('handles empty string', () => {
    expect(getAppThemeKey('')).toBe('/app_theme');
  });
});

describe('getSystemTheme', () => {
  const originalMatchMedia = globalThis.window?.matchMedia;

  afterEach(() => {
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.matchMedia = originalMatchMedia;
    }
  });

  test('returns DARK when system prefers dark color scheme', () => {
    globalThis.window.matchMedia = mock((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
    })) as unknown as typeof window.matchMedia;

    expect(getSystemTheme()).toBe(AppTheme.DARK);
  });

  test('returns LIGHT when system prefers light color scheme', () => {
    globalThis.window.matchMedia = mock((_query: string) => ({
      matches: false,
    })) as unknown as typeof window.matchMedia;

    expect(getSystemTheme()).toBe(AppTheme.LIGHT);
  });
});

describe('resolveTheme', () => {
  const navIdent = 'Z123456';
  const key = `${navIdent}/app_theme`;
  const originalMatchMedia = globalThis.window?.matchMedia;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.matchMedia = originalMatchMedia;
    }
  });

  test('returns DARK when localStorage has "dark"', () => {
    localStorage.setItem(key, 'dark');

    expect(resolveTheme(navIdent)).toBe(AppTheme.DARK);
  });

  test('returns LIGHT when localStorage has "light"', () => {
    localStorage.setItem(key, 'light');

    expect(resolveTheme(navIdent)).toBe(AppTheme.LIGHT);
  });

  test('falls back to system theme when localStorage has no value', () => {
    globalThis.window.matchMedia = mock((_query: string) => ({
      matches: false,
    })) as unknown as typeof window.matchMedia;

    expect(resolveTheme(navIdent)).toBe(AppTheme.LIGHT);
  });

  test('falls back to system theme when localStorage has unexpected value', () => {
    localStorage.setItem(key, 'banana');
    globalThis.window.matchMedia = mock((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
    })) as unknown as typeof window.matchMedia;

    expect(resolveTheme(navIdent)).toBe(AppTheme.DARK);
  });

  test('uses the correct key per navIdent', () => {
    const otherIdent = 'A999999';
    localStorage.setItem(`${otherIdent}/app_theme`, 'dark');

    globalThis.window.matchMedia = mock((_query: string) => ({
      matches: false,
    })) as unknown as typeof window.matchMedia;

    // Should not pick up the other user's preference.
    expect(resolveTheme(navIdent)).toBe(AppTheme.LIGHT);
    // Should pick up the correct user's preference.
    expect(resolveTheme(otherIdent)).toBe(AppTheme.DARK);
  });
});
