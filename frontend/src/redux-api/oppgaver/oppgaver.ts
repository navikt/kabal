import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '../common';
import { ListTagTypes } from '../tag-types';

export enum OppgaveListTagTypes {
  MINE_UFERDIGE = 'mine-uferdige',
  MINE_VENTENDE = 'mine-ventende',
  LEDIGE = 'ledige',
  ENHETENS_UFERDIGE = 'enhetens-uferdige',
  ENHETENS_VENTENDE = 'enhetens-ventende',
  PERSON_AND_OPPGAVER = 'person-and-oppgaver',
}

export enum DokumenterListTagTypes {
  DOKUMENTER = 'dokumenter',
  TILKNYTTEDEDOKUMENTER = 'tilknyttedeDokumenter',
}

export enum OppgaveTagTypes {
  OPPGAVEBEHANDLING = 'oppgavebehandling',
}

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: API_BASE_QUERY,
  tagTypes: [
    ...Object.values(ListTagTypes),
    ...Object.values(OppgaveTagTypes),
    ...Object.values(DokumenterListTagTypes),
    ...Object.values(OppgaveListTagTypes),
  ],
  endpoints: () => ({}),
});
