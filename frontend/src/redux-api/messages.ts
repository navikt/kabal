import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { IOppgavebehandlingBaseParams } from '../types/oppgavebehandling/params';
import { KABAL_OPPGAVEBEHANDLING_BASE_QUERY } from './common';

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
  author: IAuthor;
}

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: KABAL_OPPGAVEBEHANDLING_BASE_QUERY,
  tagTypes: ['messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage[], string>({
      query: (oppgaveId) => `/${oppgaveId}/meldinger`,
      providesTags: ['messages'],
    }),
    postMessage: builder.mutation<IMessage, IPostMessage & IOppgavebehandlingBaseParams>({
      invalidatesTags: ['messages'],
      query: ({ oppgaveId, ...body }) => ({
        method: 'POST',
        url: `/${oppgaveId}/meldinger`,
        body,
      }),
      onQueryStarted: async ({ oppgaveId, ...newMessage }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();
        const newMessageId = `new-message-optimistic-id-${now}`;

        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) => {
            messages.push({ ...newMessage, created: now, modified: now, id: newMessageId });
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) =>
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
