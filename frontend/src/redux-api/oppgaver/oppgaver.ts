import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '../common';
import { ListTagTypes } from '../tag-types';

export enum OppgaveListTagTypes {
  TILDELTE_OPPGAVER = 'tildelte-oppgaver',
  VENTENDE_OPPGAVER = 'ventende-oppgaver',
  LEDIGE_OPPGAVER = 'ledige-oppgaver',
  ENHETENS_TILDELTE_OPPGAVER = 'enhetens-tildelte-oppgaver',
}

export enum DokumenterListTagTypes {
  DOKUMENTER = 'dokumenter',
  TILKNYTTEDEDOKUMENTER = 'tilknyttedeDokumenter',
}

export enum OppgaveTagTypes {
  OPPGAVEBEHANDLING = 'oppgavebehandling',
}

export enum UtgaatteFristerTagTypes {
  ANTALL_LEDIGE_MEDUTGAATTEFRISTER = 'antall-ledige-medutgaattefrister',
}

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: API_BASE_QUERY,
  tagTypes: [
    ...Object.values(ListTagTypes),
    ...Object.values(OppgaveTagTypes),
    ...Object.values(UtgaatteFristerTagTypes),
    ...Object.values(OppgaveListTagTypes),
    ...Object.values(DokumenterListTagTypes),
  ],
  endpoints: () => ({}),
});
