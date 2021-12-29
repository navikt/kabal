import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { oppgavebehandlingApiUrl, staggeredBaseQuery } from './common';
import { IOppgavebehandlingBaseParams } from './oppgavebehandling-params-types';

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
  baseQuery: staggeredBaseQuery,
  tagTypes: ['messages'],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage[], IOppgavebehandlingBaseParams>({
      query: ({ type, oppgaveId }) => `${oppgavebehandlingApiUrl(type)}${oppgaveId}/meldinger`,
      providesTags: ['messages'],
    }),
    postMessage: builder.mutation<IMessage, IPostMessage & IOppgavebehandlingBaseParams>({
      invalidatesTags: ['messages'],
      query: ({ oppgaveId, type, ...body }) => ({
        method: 'POST',
        url: `${oppgavebehandlingApiUrl(type)}${oppgaveId}/meldinger`,
        body,
      }),
      onQueryStarted: async ({ oppgaveId, type, ...newMessage }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();
        const newMessageId = `new-message-optimistic-id-${now}`;

        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', { oppgaveId, type }, (messages) => {
            messages.push({ ...newMessage, created: now, modified: now, id: newMessageId });
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            messagesApi.util.updateQueryData('getMessages', { oppgaveId, type }, (messages) =>
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
