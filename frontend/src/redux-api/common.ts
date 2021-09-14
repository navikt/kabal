import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl: '/', credentials: 'include' }), { maxRetries: 3 });
