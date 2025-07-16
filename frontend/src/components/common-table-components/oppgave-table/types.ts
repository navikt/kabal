export enum OppgaveTableKey {
  LEDIGE = 'l',
  MINE_TILDELTE = 'mt',
  MINE_RETURNERTE = 'mr',
  MINE_VENTENDE = 'mv',
  ENHETENS_TILDELTE = 'et',
  ENHETENS_VENTENDE = 'ev',
  ENHETENS_FERDIGE = 'ef',
  ROL_LEDIGE = 'rl',
  ROL_TILDELTE = 'rt',
  ROL_VENTENDE = 'rv',
  ROL_RETURNERTE = 'rr',
  ROL_FERDIGE = 'rf',
}

export enum StaticOppgaveTableKey {
  SEARCH_ACTIVE = 'sa',
  SEARCH_FERDIGE = 'sf',
  SEARCH_FEILREGISTRERTE = 'se',
  SEARCH_VENTENDE = 'sv',
  RELEVANT_ACTIVE = 'ra',
  RELEVANT_VENTENDE = 'rv',
}

export const OPPGAVE_TABLE_KEYS = Object.values(OppgaveTableKey);
