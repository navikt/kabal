import { IRichText } from '../../../../types/texts/texts';

export const lexSpecialis = (maltekster: IRichText[]): IRichText | null => {
  if (maltekster.length === 0) {
    return null;
  }

  if (maltekster.length === 1) {
    return maltekster[0] ?? null;
  }

  return maltekster.find((t) => t.hjemler.length !== 0) ?? maltekster[0] ?? null;
};
