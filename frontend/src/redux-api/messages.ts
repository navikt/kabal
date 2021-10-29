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

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage[], string>({
      query: (id) => `/api/kabal-api/klagebehandlinger/${id}/meldinger`,
      providesTags: ['messages'],
    }),
    postMessage: builder.mutation<IMessage, IPostMessage>({
      invalidatesTags: ['messages'],
      query: ({ klagebehandlingId, ...body }) => ({
        method: 'POST',
        url: `/api/kabal-api/klagebehandlinger/${klagebehandlingId}/meldinger`,
        body,
      }),
      onQueryStarted: async ({ klagebehandlingId, ...newMessage }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();
        const newMessageId = `new-message-optimistic-id-${now}`;

        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', klagebehandlingId, (messages) => {
            messages.push({ ...newMessage, created: now, modified: now, id: newMessageId });
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            messagesApi.util.updateQueryData('getMessages', klagebehandlingId, (messages) =>
              messages.map((m) => {
                if (m.id === newMessageId) {
                  return data;
                }

                return m;
              })
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, usePostMessageMutation } = messagesApi;
