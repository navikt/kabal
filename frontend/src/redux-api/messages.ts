import { createApi } from '@reduxjs/toolkit/query/react';
import { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { ListTagTypes } from './tag-types';

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

enum MessageListTagTypes {
  MESSAGES = 'messages',
}

export const OPTIMISTIC_MESSAGE_ID_PREFIX = 'new-message-optimistic-id';

const messagesListTags = (messages: IMessage[] | undefined) =>
  typeof messages === 'undefined'
    ? [{ type: MessageListTagTypes.MESSAGES, id: ListTagTypes.PARTIAL_LIST }]
    : messages
        .map(({ id }) => ({ type: MessageListTagTypes.MESSAGES, id }))
        .concat({ type: MessageListTagTypes.MESSAGES, id: ListTagTypes.PARTIAL_LIST });

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  tagTypes: [MessageListTagTypes.MESSAGES],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage[], string>({
      query: (oppgaveId) => `/${oppgaveId}/meldinger`,
      providesTags: messagesListTags,
    }),
    postMessage: builder.mutation<IMessage, IPostMessage & IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId, text }) => ({
        method: 'POST',
        url: `/${oppgaveId}/meldinger`,
        body: { text },
      }),
      onQueryStarted: async ({ oppgaveId, ...newMessage }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();
        const newMessageId = `${OPTIMISTIC_MESSAGE_ID_PREFIX}-${now}`;

        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) => {
            messages.push({ ...newMessage, created: now, modified: now, id: newMessageId });
          }),
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
              }),
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, usePostMessageMutation } = messagesApi;
