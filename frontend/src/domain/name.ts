import { LegacyNavn } from '@app/types/legacy';

export const getFullName = (name?: LegacyNavn | null): string => {
  if (name === null || typeof name === 'undefined') {
    return '-';
  }

  const { fornavn, mellomnavn, etternavn } = name;
  const navnListe = [fornavn, mellomnavn, etternavn].filter((n) => typeof n === 'string' && n.length !== 0);

  if (navnListe.length === 0) {
    return '-';
  }

  return navnListe.join(' ');
};
