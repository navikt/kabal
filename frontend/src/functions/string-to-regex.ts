const EMPTY_REGEX = /.*/;

export const stringToRegExp = (s: string): RegExp => {
  if (s.length === 0) {
    return EMPTY_REGEX;
  }

  const pattern = removeRegExpTokens(s).split('').join('.*');
  const escapedPattern = escapeRegExp(pattern);
  const filter = new RegExp(`.*${escapedPattern}.*`, 'i');

  return filter;
};

const removeRegExpTokens = (pattern: string): string => pattern.replace(/[/\\^$*+?.()|[\]{}\s]/g, '');
const escapeRegExp = (pattern: string): string => pattern.replaceAll('-', '\\-');
