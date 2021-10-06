import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { staggeredBaseQuery } from './common';

interface IMessage {
  author: IAuthor;
  created: string;
  id: string;
  modified: string;
  text: string;
}

interface IAuthor {
  name: string;
  saksbehandlerIdent: string;
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage, string>({
      query: (id) => `/api/klagebehandlinger/${id}/meldinger`,
      providesTags: ['messages'],
    }),
  }),
});
