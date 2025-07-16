export enum OppgaveTableKey {
  LEDIGE = 'l',
  MINE_UFERDIGE = 'mu',
  MINE_RETURNERTE = 'mr',
  MINE_VENTENDE = 'mv',
  ENHETENS_UFERDIGE = 'eu',
  ENHETENS_VENTENDE = 'ev',
  ENHETENS_FERDIGE = 'ef',
  ROL_LEDIGE = 'rl',
  ROL_UFERDIGE = 'ru',
  ROL_VENTENDE = 'rv',
  ROL_RETURNERTE = 'rr',
  ROL_FERDIGE = 'rf',
}

export enum StaticOppgaveTableKey {
  SEARCH_ACTIVE = 'sa',
  SEARCH_FERDIGE = 'sf',
  SEARCH_FEILREGISTRERTE = 'se',
  SEARCH_VENTENDE = 'sv',
}

export const OPPGAVE_TABLE_KEYS = Object.values(OppgaveTableKey);
