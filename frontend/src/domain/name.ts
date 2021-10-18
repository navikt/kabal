import { Name } from './types';

export const getFullName = (name: Name | null): string => {
  if (name === null) {
    return '-';
  }

  const { fornavn, mellomnavn, etternavn } = name;
  const navnListe = [fornavn, mellomnavn, etternavn].filter((n) => typeof n === 'string' && n.length !== 0);

  if (navnListe.length === 0) {
    return '-';
  }

  return navnListe.join(' ');
};

export const getFullNameWithFnr = (name: Name | null, fnr: string | null) => {
  const fulltNavn = getFullName(name);

  if (typeof fnr === 'string' && fnr.length === 11) {
    return `${fulltNavn} (${fnr})`;
  }

  return fulltNavn;
};
