import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import type { INavEmployee } from '@app/types/bruker';
import { isApiRejectionError } from '@app/types/errors';
import type { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { ListTagTypes } from './tag-types';

export interface IMessage {
  author: INavEmployee;
  created: string;
  id: string;
  modified: string | null;
  text: string;
  notify: boolean;
}

interface IPostMessage {
  text: string;
  author: INavEmployee;
  notify: boolean;
}

enum MessageListTagTypes {
  MESSAGES = 'messages',
}

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
      query: ({ oppgaveId, text, notify }) => ({
        method: 'POST',
        url: `/${oppgaveId}/meldinger`,
        body: { text, notify },
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) =>
              messages.some((m) => m.id === data.id)
                ? messages
                : [data, ...messages].toSorted((a, b) => b.created.localeCompare(a.created)),
            ),
          );
        } catch (error) {
          const heading = 'Kunne ikke sende melding';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, usePostMessageMutation } = messagesApi;
