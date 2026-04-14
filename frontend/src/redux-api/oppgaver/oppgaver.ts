import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '@/redux-api/common';
import { ListTagTypes } from '@/redux-api/tag-types';

export enum OppgaveListTagTypes {
  MINE_UFERDIGE = 'mine-uferdige',
  MINE_FERDIGE = 'mine-ferdige',
  MINE_VENTENDE = 'mine-ventende',
  LEDIGE = 'ledige',
  ENHETENS_UFERDIGE = 'enhetens-uferdige',
  ENHETENS_FERDIGE = 'enhetens-ferdige',
  ENHETENS_VENTENDE = 'enhetens-ventende',
  PERSON_AND_OPPGAVER = 'person-and-oppgaver',
  ROL_LEDIGE = 'rol-ledige',
  ROL_UFERDIGE = 'rol-uferdige',
  ROL_FERDIGE = 'rol-ferdige',
  KROLS_UFERDIGE = 'krols-uferdige',
  KROLS_FERDIGE = 'krols-ferdige',
  KROLS_VENTENDE = 'krols-ventende',
  TR_TILDELTE = 'tr-tildelte',
  TR_LEDIGE = 'tr-ledige',
  TR_VENTENDE = 'tr-ventende',
}

export const OPPGAVELIST_TAG_TYPES = Object.values(OppgaveListTagTypes);

export enum OppgaveData {
  OPPGAVE_DATA = 'oppgave-data',
}

export enum DokumenterListTagTypes {
  DOKUMENTER = 'dokumenter',
  TILKNYTTEDEDOKUMENTER = 'tilknyttedeDokumenter',
}

export enum OppgaveTagTypes {
  OPPGAVEBEHANDLING = 'oppgavebehandling',
}

export enum BehandlingsdialogTagTypes {
  POTENTIAL_MU = 'potential-mu',
  POTENTIAL_ROL = 'potential-rol',
}

export const BEHANDLINGSDIALOG_TAG_TYPES = Object.values(BehandlingsdialogTagTypes);
export const OPPGAVE_LIST_TAG_TYPES = Object.values(OppgaveListTagTypes);

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: API_BASE_QUERY,
  tagTypes: [
    ...Object.values(ListTagTypes),
    ...Object.values(OppgaveTagTypes),
    ...Object.values(DokumenterListTagTypes),
    ...OPPGAVE_LIST_TAG_TYPES,
    ...Object.values(OppgaveData),
    ...BEHANDLINGSDIALOG_TAG_TYPES,
  ],
  endpoints: () => ({}),
});
