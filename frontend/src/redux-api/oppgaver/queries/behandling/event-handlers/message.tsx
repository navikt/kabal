import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { InfoToast } from '@app/components/toast/info-toast';
import { toast } from '@app/components/toast/store';
import { reduxStore } from '@app/redux/configure-store';
import { IMessage, OPTIMISTIC_MESSAGE_ID_PREFIX, messagesApi } from '@app/redux-api/messages';
import { NewMessageEvent } from '@app/redux-api/server-sent-events/types';

export const handleMessageEvent = (oppgaveId: string, userId: string) => (event: NewMessageEvent) => {
  if (event.actor.navIdent !== userId) {
    toast.info(
      <InfoToast title={`Ny melding fra ${event.actor.navn}`}>
        <BodyShort>{event.text}</BodyShort>
      </InfoToast>,
    );
  }

  reduxStore.dispatch(
    messagesApi.util.updateQueryData('getMessages', oppgaveId, (messages) => {
      const { id, text, timestamp, actor } = event;
      const message: IMessage = {
        author: { name: actor.navn, saksbehandlerIdent: actor.navIdent },
        id,
        text,
        created: timestamp,
        modified: timestamp,
      };

      if (messages === undefined) {
        return [message];
      }

      const updatedList: IMessage[] = [];
      let isUpdate = false;

      for (const m of messages) {
        if (m.id === message.id) {
          updatedList.push(message);
          isUpdate = true;
        } else if (!m.id.startsWith(OPTIMISTIC_MESSAGE_ID_PREFIX)) {
          updatedList.push(m);
        }
      }

      return isUpdate ? updatedList : [message, ...updatedList];
    }),
  );
};
