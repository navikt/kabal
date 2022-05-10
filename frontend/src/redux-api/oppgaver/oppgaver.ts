import { createApi } from '@reduxjs/toolkit/query/react';
import { API_BASE_QUERY } from '../common';

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: API_BASE_QUERY,
  tagTypes: [
    'oppgavebehandling',
    'dokumenter',
    'tilknyttedeDokumenter',
    'tildelte-oppgaver',
    'ventende-oppgaver',
    'ledige-oppgaver',
    'ledige-medutgaattefrister',
    'enhetens-tildelte-oppgaver',
  ],
  endpoints: () => ({}),
});
