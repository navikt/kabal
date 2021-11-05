import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const isLocalhost = window.location.hostname === 'localhost';
export const baseUrl = isLocalhost ? 'https://kabal.dev.nav.no/' : '/';
export const brevUrl = isLocalhost ? 'https://kabal-smart-editor-api.dev.intern.nav.no/' : '/';
export const brevPdfUrl = isLocalhost ? 'https://kabal-json-to-pdf.dev.nav.no/topdf/' : '/';
const mode: RequestMode | undefined = isLocalhost ? 'cors' : undefined;

export const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl, mode, credentials: 'include' }), {
  maxRetries: 3,
});
