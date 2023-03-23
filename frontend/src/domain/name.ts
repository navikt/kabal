import { formatFoedselsnummer } from '@app/functions/format-id';
import { ISakspart } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Name } from './types';

export const getFullName = (name?: Name | null): string => {
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

export const getFullNameWithFnr = (name?: Name | null, fnr?: string | null) => {
  const fulltNavn = getFullName(name);

  if (typeof fnr === 'string' && fnr.length === 11) {
    return `${fulltNavn} (${formatFoedselsnummer(fnr)})`;
  }

  return fulltNavn;
};

export const getOrgName = (navn: string | null): string => (navn !== null ? navn : '-');

export const getSakspartName = (sakspart: ISakspart) => {
  const { person, virksomhet } = sakspart;

  if (person !== null) {
    return getFullName(person.navn);
  }

  if (virksomhet !== null) {
    return `${virksomhet.navn ?? ''} ${
      virksomhet.virksomhetsnummer === null ? '' : `(${virksomhet.virksomhetsnummer})`
    }`;
  }

  return null;
};
