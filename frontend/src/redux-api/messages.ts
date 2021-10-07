import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { staggeredBaseQuery } from './common';

export interface IMessage {
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

interface IPostMessage {
  text: string;
  klagebehandlingId: string;
  author: IAuthor;
}

interface IPostMessageResponse {
  created: string;
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage[], string>({
      query: (id) => `/api/klagebehandlinger/${id}/meldinger`,
      providesTags: ['messages'],
    }),
    postMessage: builder.mutation<IPostMessageResponse, IPostMessage>({
      invalidatesTags: ['messages'],
      query: ({ klagebehandlingId, ...body }) => ({
        method: 'POST',
        url: `/api/klagebehandlinger/${klagebehandlingId}/meldinger`,
        body,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...newMessage }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', klagebehandlingId, (messages) => {
            const now = new Date().toISOString();
            messages.push({ ...newMessage, created: now, modified: now, id: '' });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, usePostMessageMutation } = messagesApi;
