export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export const getAppThemeKey = (navIdent: string) => `${navIdent}/app_theme`;

export const getSystemTheme = (): AppTheme =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? AppTheme.DARK
    : AppTheme.LIGHT;

export const resolveTheme = (navIdent: string): AppTheme => {
  const stored = localStorage.getItem(getAppThemeKey(navIdent));

  if (stored === 'dark') {
    return AppTheme.DARK;
  }

  if (stored === 'light') {
    return AppTheme.LIGHT;
  }

  return getSystemTheme();
};
