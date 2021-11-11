import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const isLocalhost = window.location.hostname === 'localhost';
export const baseUrl = isLocalhost ? 'https://kabal.dev.nav.no/' : '/';
const mode: RequestMode | undefined = isLocalhost ? 'cors' : undefined;

export const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl, mode, credentials: 'include' }), {
  maxRetries: 3,
});
