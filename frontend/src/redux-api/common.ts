import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const staggeredBaseQuery = retry(fetchBaseQuery({ baseUrl: '/api' }), { maxRetries: 3 });
