export const formatSakenGjelder = (id: string | undefined): string | null => {
  if (typeof id === 'undefined') {
    return null;
  }

  if (id.length === 9) {
    return formatOrgNum(id);
  }

  if (id.length === 11) {
    return formatPersonNum(id);
  }

  return id;
};

export const formatOrgNum = (n: string): string => {
  const [a, b, c, d, e, f, g, h, i] = n;
  return `${a}${b}${c} ${d}${e}${f} ${g}${h}${i}`;
};

export const formatPersonNum = (n: string | undefined): string | null => {
  if (typeof n === 'undefined') {
    return null;
  }

  const [a, b, c, d, e, f, g, h, i, j, k] = n;
  return `${a}${b}${c}${d}${e}${f} ${g}${h}${i}${j}${k}`;
};
