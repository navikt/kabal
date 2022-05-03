export const formatSakenGjelder = (id: string | undefined): string => {
  if (typeof id === 'undefined') {
    return '';
  }

  const array = id.split('');

  if (isOrgNum(array)) {
    return unsafeFormatOrgNum(array);
  }

  if (isPersonNum(array)) {
    return unsafeFormatPersonNum(array);
  }

  return id;
};

type OrgNum = [string, string, string, string, string, string, string, string, string];
type PersonNum = [string, string, string, string, string, string, string, string, string, string, string];

const isOrgNum = (id: string[]): id is OrgNum => id.length === 9;
const isPersonNum = (id: string[]): id is PersonNum => id.length === 11;

const unsafeFormatOrgNum = ([a, b, c, d, e, f, g, h, i]: OrgNum): string => `${a}${b}${c} ${d}${e}${f} ${g}${h}${i}`;

export const formatOrgNum = (n: string): string => {
  const array = n.split('');

  if (isOrgNum(array)) {
    return unsafeFormatOrgNum(array);
  }

  return n;
};

const unsafeFormatPersonNum = ([a, b, c, d, e, f, g, h, i, j, k]: PersonNum) =>
  `${a}${b}${c}${d}${e}${f} ${g}${h}${i}${j}${k}`;

export const formatPersonNum = (n: string | undefined | null): string => {
  if (n === null || typeof n === 'undefined') {
    return '';
  }

  const array = n.split('');

  if (isPersonNum(array)) {
    return unsafeFormatPersonNum(array);
  }

  return n;
};
