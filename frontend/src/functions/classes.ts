import { isNotUndefined } from '@/functions/is-not-type-guards';

export const merge = (...classes: (string | undefined)[]) =>
  classes.filter((c) => isNotUndefined(c) && c.length > 0).join(' ');
