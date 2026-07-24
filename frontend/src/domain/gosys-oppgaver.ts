import type { SortState } from '@navikt/ds-react';
import type { INavEmployee } from '@/types/bruker';
import type { Enhet, ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

export const getDirection = (sortState: ScopedSortState, sortKey: keyof ListGosysOppgave): SortState['direction'] => {
  if (sortState.orderBy !== sortKey) {
    return 'ascending';
  }

  return sortState.direction === 'ascending' ? 'descending' : 'ascending';
};

const GOSYS_OPPGAVE_KEYS: (keyof ListGosysOppgave)[] = [
  'id',
  'tildeltEnhetsnr',
  'endretAvEnhetsnr',
  'endretAv',
  'endretTidspunkt',
  'opprettetAv',
  'opprettetTidspunkt',
  'beskrivelse',
  'temaId',
  'gjelder',
  'oppgavetype',
  'fristFerdigstillelse',
  'ferdigstiltTidspunkt',
  'status',
  'editable',
  'opprettetAvEnhet',
  'alreadyUsedBy',
];

const GOSYS_STATUS_KEY_STRINGS: string[] = GOSYS_OPPGAVE_KEYS.map((key) => key);

export const isKeyofGosysOppgave = (key: string): key is keyof ListGosysOppgave =>
  GOSYS_STATUS_KEY_STRINGS.includes(key);

export interface ScopedSortState extends SortState {
  orderBy: keyof ListGosysOppgave;
}

export const sortGosysOppgaver = (
  data: ListGosysOppgave[],
  { direction, orderBy }: ScopedSortState,
  enheter: Enhet[],
): ListGosysOppgave[] =>
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  data.toSorted((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (aVal === null) {
      return bVal === null ? 0 : 1;
    }

    if (bVal === null) {
      return -1;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'ascending' ? aVal - bVal : bVal - aVal;
    }

    if (orderBy === 'opprettetAvEnhet') {
      const aEnhet = `${a.opprettetAvEnhet?.navn ?? ''} (${a.opprettetAvEnhet?.enhetsnr ?? ''})`;
      const bEnhet = `${b.opprettetAvEnhet?.navn ?? ''} (${b.opprettetAvEnhet?.enhetsnr ?? ''})`;

      return direction === 'ascending' ? aEnhet.localeCompare(bEnhet) : bEnhet.localeCompare(aEnhet);
    }

    if (orderBy === 'tildeltEnhetsnr') {
      const aEnhetName = enheter.find((e) => e.enhetsnr === aVal)?.navn ?? '';
      const bEnhetName = enheter.find((e) => e.enhetsnr === bVal)?.navn ?? '';

      const aEnhet = `${aEnhetName} (${aVal})`;
      const bEnhet = `${bEnhetName} (${bVal})`;

      return direction === 'ascending' ? aEnhet.localeCompare(bEnhet) : bEnhet.localeCompare(aEnhet);
    }

    if (orderBy === 'opprettetAv' || orderBy === 'endretAv') {
      const aName = isINavEmployee(aVal, orderBy) ? aVal.navn : '';
      const bName = isINavEmployee(bVal, orderBy) ? bVal.navn : '';

      return direction === 'ascending' ? aName.localeCompare(bName) : bName.localeCompare(aName);
    }

    return 0;
  });

const isINavEmployee = (_: unknown, key: string): _ is INavEmployee => key === 'opprettetAv' || key === 'endretAv';
