import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import type { INavEmployee } from '@app/types/bruker';
import type { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import { createApi } from '@reduxjs/toolkit/query/react';
import { format } from 'date-fns';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { ListTagTypes } from './tag-types';

export interface IMessage {
  author: INavEmployee;
  created: string;
  id: string;
  modified: string;
  text: string;
}

interface IPostMessage {
  text: string;
  author: INavEmployee;
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
        const now = format(new Date(), ISO_DATETIME_FORMAT);
        const newMessageId = `${OPTIMISTIC_MESSAGE_ID_PREFIX}-${now}`;

        const patchResult = dispatch(
          messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) => [
            { ...newMessage, created: now, modified: now, id: newMessageId },
            ...messages,
          ]),
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
