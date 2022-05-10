export const stringToRegExp = (s: string): RegExp => {
  const cleanFilter = removeRegExpTokens(s);
  const pattern = cleanFilter.split('').join('.*');
  const escapedPattern = escapeRegExp(pattern);
  const filter = new RegExp(`.*${escapedPattern}.*`, 'i');

  return filter;
};

const removeRegExpTokens = (pattern: string): string => pattern.replace(/[/\\^$*+?.()|[\]{}\s]/g, '');
const escapeRegExp = (pattern: string): string => pattern.replaceAll('-', '\\-');
